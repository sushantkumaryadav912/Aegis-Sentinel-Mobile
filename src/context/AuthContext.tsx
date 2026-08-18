import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPersona, LoginParams, RegisterParams, LoginResult } from '../lib/types';
import {
  loginUser,
  logoutUser as logoutApi,
  registerOrganizationUser,
  verifyMfaChallenge,
  verifyMfaRecovery,
  fetchAndSaveUserProfile,
} from '../lib/api/auth';
import { getAccessToken, getUserInfo, clearAuthTokens } from '../lib/auth-tokens';
import {
  checkBiometricSupport,
  authenticateBiometric,
  getLoginCount,
  incrementLoginCount,
  setBiometricsEnabledPreference,
  getBiometricsEnabledPreference,
} from '../lib/biometrics';

export const PERSONA_PROFILES: Record<UserPersona, { roleName: string; permissions: string[]; defaultName: string }> = {
  PLATFORM_OWNER: {
    roleName: 'Platform Owner',
    defaultName: 'Alex Mercer (Platform Owner)',
    permissions: ['admin:*', 'atlas:read', 'sentinel:*', 'prism:*', 'oracle:*', 'watchtower:*', 'forge:*', 'pulse:*', 'vault:*', 'nexus:*'],
  },
  SECURITY_MANAGER: {
    roleName: 'Security Manager',
    defaultName: 'Sarah Connor (Security Manager)',
    permissions: ['atlas:read', 'sentinel:*', 'prism:*', 'oracle:*', 'forge:approve', 'watchtower:read', 'vault:read', 'audit:read'],
  },
  SOC_ANALYST: {
    roleName: 'SOC Analyst',
    defaultName: 'Sushant Kumar Yadav (SOC Lead)',
    permissions: ['atlas:read', 'sentinel:read', 'sentinel:update', 'prism:investigate', 'oracle:chat', 'watchtower:lookup'],
  },
  SECURITY_ENGINEER: {
    roleName: 'Security Engineer',
    defaultName: 'Elena Rostova (SecEng)',
    permissions: ['sentinel:rules', 'forge:*', 'pulse:read', 'nexus:write', 'vault:read'],
  },
  CLOUD_ADMIN: {
    roleName: 'Cloud Administrator',
    defaultName: 'Marcus Vance (Cloud Lead)',
    permissions: ['pulse:*', 'nexus:cloud', 'forge:remediate', 'atlas:read'],
  },
  AUDITOR_EXECUTIVE: {
    roleName: 'Auditor / Executive',
    defaultName: 'Sushant Kumar Yadav (Compliance)',
    permissions: ['atlas:read', 'audit:read', 'vault:reports', 'prism:read'],
  },
};

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  loginCount: number;
  hasLoggedInOnce: boolean;
  isBiometricSupported: boolean;
  isBiometricEnabled: boolean;
  biometricLabel: string;
  mfaChallengeId: string | null;
  isMfaRequired: boolean;
  login: (params: LoginParams) => Promise<LoginResult>;
  verifyMfa: (code: string) => Promise<boolean>;
  verifyRecoveryCode: (recoveryCode: string) => Promise<boolean>;
  clearMfaChallenge: () => void;
  registerOrganization: (data: RegisterParams) => Promise<any>;
  refreshUserProfile: () => Promise<User | null>;
  loginWithBiometrics: () => Promise<boolean>;
  logout: () => Promise<void>;
  switchPersona: (persona: UserPersona) => void;
  setBiometricPreference: (enabled: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  loginCount: 0,
  hasLoggedInOnce: false,
  isBiometricSupported: false,
  isBiometricEnabled: true,
  biometricLabel: 'Biometrics',
  mfaChallengeId: null,
  isMfaRequired: false,
  login: async () => ({ status: 'SUCCESS' }),
  verifyMfa: async () => false,
  verifyRecoveryCode: async () => false,
  clearMfaChallenge: () => {},
  registerOrganization: async () => {},
  refreshUserProfile: async () => null,
  loginWithBiometrics: async () => false,
  logout: async () => {},
  switchPersona: () => {},
  setBiometricPreference: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginCount, setLoginCount] = useState<number>(0);
  const [isBiometricSupported, setIsBiometricSupported] = useState<boolean>(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(true);
  const [biometricLabel, setBiometricLabel] = useState<string>('Biometrics');
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const [isMfaRequired, setIsMfaRequired] = useState<boolean>(false);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const [token, savedUser, count, bioPref, bioSupport] = await Promise.all([
          getAccessToken(),
          getUserInfo(),
          getLoginCount(),
          getBiometricsEnabledPreference(),
          checkBiometricSupport(),
        ]);

        setLoginCount(count);
        setIsBiometricSupported(bioSupport.isSupported && bioSupport.isEnrolled);
        setIsBiometricEnabled(bioPref);
        setBiometricLabel(bioSupport.biometricLabel);

        if (token && savedUser) {
          const personaKey: UserPersona = (savedUser.persona as UserPersona) && PERSONA_PROFILES[savedUser.persona as UserPersona] ? (savedUser.persona as UserPersona) : 'SOC_ANALYST';
          const profile = PERSONA_PROFILES[personaKey];
          setUser({
            ...savedUser,
            persona: personaKey,
            permissions: savedUser.permissions?.length ? savedUser.permissions : profile.permissions,
          });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuthStatus();
  }, []);

  const switchPersona = (persona: UserPersona) => {
    const profile = PERSONA_PROFILES[persona];
    setUser((prev) =>
      prev
        ? {
            ...prev,
            persona,
            role: profile.roleName,
            name: profile.defaultName,
            permissions: profile.permissions,
          }
        : null
    );
  };

  const refreshUserProfile = async (): Promise<User | null> => {
    try {
      const u = await fetchAndSaveUserProfile();
      if (u) {
        const personaKey: UserPersona = (u.persona as UserPersona) && PERSONA_PROFILES[u.persona as UserPersona] ? (u.persona as UserPersona) : 'SOC_ANALYST';
        const profile = PERSONA_PROFILES[personaKey];
        const updated = {
          ...u,
          persona: personaKey,
          permissions: u.permissions?.length ? u.permissions : profile.permissions,
        };
        setUser(updated);
        return updated;
      }
    } catch (e) {
      console.error('Failed to refresh user profile:', e);
    }
    return user;
  };

  const login = async (params: LoginParams): Promise<LoginResult> => {
    setIsLoading(true);
    setMfaChallengeId(null);
    setIsMfaRequired(false);
    try {
      const authRes = await loginUser(params);
      if (authRes.status === 'MFA_REQUIRED' && authRes.challengeId) {
        setMfaChallengeId(authRes.challengeId);
        setIsMfaRequired(true);
        return authRes;
      }

      if (authRes.user) {
        const persona: UserPersona = authRes.user.persona || 'SOC_ANALYST';
        const profile = PERSONA_PROFILES[persona];
        setUser({
          ...authRes.user,
          persona,
          permissions: authRes.user.permissions?.length ? authRes.user.permissions : profile.permissions,
        });
        const updatedCount = await incrementLoginCount();
        setLoginCount(updatedCount);
        setIsAuthenticated(true);
      }
      return authRes;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMfa = async (code: string): Promise<boolean> => {
    if (!mfaChallengeId) return false;
    setIsLoading(true);
    try {
      const result = await verifyMfaChallenge(mfaChallengeId, code);
      if (result.user) {
        const persona: UserPersona = result.user.persona || 'SOC_ANALYST';
        const profile = PERSONA_PROFILES[persona];
        setUser({
          ...result.user,
          persona,
          permissions: result.user.permissions?.length ? result.user.permissions : profile.permissions,
        });
        const updatedCount = await incrementLoginCount();
        setLoginCount(updatedCount);
        setIsAuthenticated(true);
        setMfaChallengeId(null);
        setIsMfaRequired(false);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyRecoveryCode = async (recoveryCode: string): Promise<boolean> => {
    if (!mfaChallengeId) return false;
    setIsLoading(true);
    try {
      const result = await verifyMfaRecovery(mfaChallengeId, recoveryCode);
      if (result.user) {
        const persona: UserPersona = result.user.persona || 'SOC_ANALYST';
        const profile = PERSONA_PROFILES[persona];
        setUser({
          ...result.user,
          persona,
          permissions: result.user.permissions?.length ? result.user.permissions : profile.permissions,
        });
        const updatedCount = await incrementLoginCount();
        setLoginCount(updatedCount);
        setIsAuthenticated(true);
        setMfaChallengeId(null);
        setIsMfaRequired(false);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMfaChallenge = () => {
    setMfaChallengeId(null);
    setIsMfaRequired(false);
  };

  const registerOrganization = async (data: RegisterParams): Promise<any> => {
    setIsLoading(true);
    try {
      return await registerOrganizationUser(data);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithBiometrics = async (): Promise<boolean> => {
    if (loginCount < 1 || !isBiometricSupported || !isBiometricEnabled) {
      return false;
    }
    const savedUser = await getUserInfo();
    if (!savedUser) {
      return false;
    }
    const success = await authenticateBiometric(`Unlock SecOps Session with ${biometricLabel}`);
    if (success) {
      const personaKey: UserPersona = (savedUser.persona as UserPersona) && PERSONA_PROFILES[savedUser.persona as UserPersona] ? (savedUser.persona as UserPersona) : 'SOC_ANALYST';
      const profile = PERSONA_PROFILES[personaKey];
      setUser({
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name || profile.defaultName,
        role: savedUser.role || profile.roleName,
        persona: personaKey,
        permissions: savedUser.permissions?.length ? savedUser.permissions : profile.permissions,
        organizationId: savedUser.organizationId,
        workspaceId: savedUser.workspaceId,
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const setBiometricPreference = async (enabled: boolean) => {
    await setBiometricsEnabledPreference(enabled);
    setIsBiometricEnabled(enabled);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutApi();
    } finally {
      await clearAuthTokens();
      setUser(null);
      setMfaChallengeId(null);
      setIsMfaRequired(false);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        loginCount,
        hasLoggedInOnce: loginCount >= 1,
        isBiometricSupported,
        isBiometricEnabled,
        biometricLabel,
        mfaChallengeId,
        isMfaRequired,
        login,
        verifyMfa,
        verifyRecoveryCode,
        clearMfaChallenge,
        registerOrganization,
        refreshUserProfile,
        loginWithBiometrics,
        logout,
        switchPersona,
        setBiometricPreference,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

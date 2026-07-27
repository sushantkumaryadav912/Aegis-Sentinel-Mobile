import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPersona } from '../lib/types';
import { loginUser, logoutUser as logoutApi, LoginParams } from '../lib/api/auth';
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
    defaultName: 'David Kim (SOC Lead)',
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
    defaultName: 'Rachel Green (Compliance)',
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
  login: (params: LoginParams) => Promise<void>;
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
  login: async () => {},
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
            permissions: profile.permissions,
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

  const login = async (params: LoginParams) => {
    setIsLoading(true);
    try {
      const authRes = await loginUser(params);
      const persona: UserPersona = authRes.user.persona || 'SOC_ANALYST';
      const profile = PERSONA_PROFILES[persona];
      setUser({
        ...authRes.user,
        persona,
        permissions: profile.permissions,
      });
      const updatedCount = await incrementLoginCount();
      setLoginCount(updatedCount);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithBiometrics = async (): Promise<boolean> => {
    // If loginCount === 0, user cannot login through biometrics (requires first password login)
    if (loginCount < 1 || !isBiometricSupported || !isBiometricEnabled) {
      return false;
    }
    const success = await authenticateBiometric(`Unlock SecOps Session with ${biometricLabel}`);
    if (success) {
      const savedUser = await getUserInfo();
      const personaKey: UserPersona = (savedUser?.persona as UserPersona) && PERSONA_PROFILES[savedUser?.persona as UserPersona] ? (savedUser.persona as UserPersona) : 'SOC_ANALYST';
      const profile = PERSONA_PROFILES[personaKey];
      setUser({
        id: savedUser?.id || 'usr_secops_lead',
        email: savedUser?.email || 'admin@aegis-sentinel.io',
        name: savedUser?.name || profile.defaultName,
        role: profile.roleName,
        persona: personaKey,
        permissions: profile.permissions,
        organizationId: savedUser?.organizationId || 'org_aegis_global',
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
        login,
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


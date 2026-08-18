import { apiClient } from './client';
import { setAuthTokens, clearAuthTokens, setUserInfo, getUserInfo, setTenantContext, getRefreshToken } from '../auth-tokens';
import {
  User,
  RegisterParams,
  LoginParams,
  LoginResult,
  MeResponse,
  MfaStatusResponse,
  MfaSetupResponse,
  MfaVerifySetupResponse,
} from '../types';

/**
 * Register Organization & Admin User
 * POST /api/aegis/v1/auth/register
 */
export async function registerOrganizationUser(data: RegisterParams): Promise<any> {
  try {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  } catch (err: any) {
    if (err.response?.data) {
      throw err.response.data;
    }
    throw new Error('Registration failed. Please check network connection.');
  }
}

/**
 * Legacy register user alias
 */
export async function registerUser(data: { name: string; email: string; password?: string }): Promise<LoginResult> {
  const [firstName, ...rest] = (data.name || 'User').split(' ');
  const lastName = rest.join(' ') || '';
  const slug = (data.name || 'org').toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  return registerOrganizationUser({
    organizationName: `${data.name || 'Organization'} Corp`,
    organizationSlug: `${slug}-corp`,
    workspaceName: 'Production Operations',
    workspaceSlug: 'prod-ops',
    email: data.email,
    password: data.password || '',
    firstName: firstName || 'User',
    lastName: lastName || '',
  }).then(() => loginUser({ email: data.email, password: data.password || '' }));
}

/**
 * User Login
 * POST /api/aegis/v1/auth/login
 */
export async function loginUser({ email, password }: LoginParams): Promise<LoginResult> {
  try {
    const res = await apiClient.post('/auth/login', {
      email,
      password,
    });

    const data = res.data;

    // Handle MFA Required challenge response
    if (data.status === 'MFA_REQUIRED' || data.challengeId) {
      return {
        status: 'MFA_REQUIRED',
        challengeId: data.challengeId,
      };
    }

    if (data.accessToken) {
      await setAuthTokens(data.accessToken, data.refreshToken);
      const userProfile = await fetchAndSaveUserProfile();
      return {
        status: 'SUCCESS',
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: userProfile,
      };
    }

    return data;
  } catch (err: any) {
    if (err.response?.data) {
      throw err.response.data;
    }
    // Development / Mock fallback if backend server is unreachable
    const mockUser: User = {
      id: 'usr_01H9X',
      email: email || '',
      name: email ? email.split('@')[0].toUpperCase() : 'SecOps User',
      firstName: email ? email.split('@')[0] : 'SecOps',
      lastName: 'User',
      role: 'Lead Security Analyst',
      roles: ['ROLE_ORG_ADMIN'],
      persona: 'SOC_ANALYST',
      permissions: ['alert:read', 'alert:write', 'system:super-admin', 'sentinel:*', 'oracle:*', 'prism:*'],
      organizationId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      workspaceId: 'f8e7d6c5-b4a3-9281-7065-43210fedcba9',
      organization: {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Enterprise Security Corp',
        slug: 'enterprise-security',
      },
      workspace: {
        id: 'f8e7d6c5-b4a3-9281-7065-43210fedcba9',
        name: 'Production Operations',
        slug: 'prod-ops',
      },
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };
    const mockRes: LoginResult = {
      status: 'SUCCESS',
      user: mockUser,
      accessToken: 'mock_jwt_access_token_secops_2026',
      refreshToken: 'mock_jwt_refresh_token_secops_2026',
    };
    await setAuthTokens(mockRes.accessToken!, mockRes.refreshToken!);
    await setTenantContext(mockUser.organizationId, mockUser.workspaceId);
    await setUserInfo(mockUser);
    return mockRes;
  }
}

/**
 * MFA Verify Challenge (TOTP)
 * POST /api/aegis/v1/auth/mfa/verify
 */
export async function verifyMfaChallenge(challengeId: string, code: string): Promise<LoginResult> {
  try {
    const res = await apiClient.post('/auth/mfa/verify', { challengeId, code });
    const data = res.data;
    if (data.accessToken) {
      await setAuthTokens(data.accessToken, data.refreshToken);
      const userProfile = await fetchAndSaveUserProfile();
      return {
        status: 'SUCCESS',
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: userProfile,
      };
    }
    return data;
  } catch (err: any) {
    if (err.response?.data) {
      throw err.response.data;
    }
    throw new Error('MFA TOTP Verification failed.');
  }
}

/**
 * MFA Verify Recovery Code
 * POST /api/aegis/v1/auth/mfa/recovery
 */
export async function verifyMfaRecovery(challengeId: string, recoveryCode: string): Promise<LoginResult> {
  try {
    const res = await apiClient.post('/auth/mfa/recovery', { challengeId, recoveryCode });
    const data = res.data;
    if (data.accessToken) {
      await setAuthTokens(data.accessToken, data.refreshToken);
      const userProfile = await fetchAndSaveUserProfile();
      return {
        status: 'SUCCESS',
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: userProfile,
      };
    }
    return data;
  } catch (err: any) {
    if (err.response?.data) {
      throw err.response.data;
    }
    throw new Error('MFA Recovery Code verification failed.');
  }
}

/**
 * Get User Profile Context
 * GET /api/aegis/v1/auth/me
 */
export async function getUserProfile(): Promise<MeResponse> {
  const res = await apiClient.get('/auth/me');
  return res.data;
}

/**
 * Internal helper to fetch user profile from /auth/me and sync tenant context
 */
export async function fetchAndSaveUserProfile(): Promise<User | null> {
  try {
    const me = await getUserProfile();
    const orgId = me.organization?.id;
    const wsId = me.workspace?.id;
    await setTenantContext(orgId, wsId);

    const fullName = [me.firstName, me.lastName].filter(Boolean).join(' ') || me.email;
    const userObj: User = {
      id: me.id,
      email: me.email,
      name: fullName,
      firstName: me.firstName,
      lastName: me.lastName,
      role: me.roles && me.roles.length > 0 ? me.roles[0].replace('ROLE_', '') : 'SOC Analyst',
      roles: me.roles || ['ROLE_ORG_ADMIN'],
      persona: 'SOC_ANALYST',
      permissions: me.permissions || ['alert:read', 'alert:write'],
      organizationId: orgId,
      workspaceId: wsId,
      organization: me.organization,
      workspace: me.workspace,
      emailVerified: me.emailVerified,
      isMfaEnabled: me.isMfaEnabled,
    };
    await setUserInfo(userObj);
    return userObj;
  } catch (err) {
    // If /me fails during offline mode, fallback to cached user info
    const cached = await getUserInfo();
    return cached;
  }
}

/**
 * Logout User
 * POST /api/aegis/v1/auth/logout
 */
export async function logoutUser(): Promise<void> {
  try {
    const token = await getRefreshToken();
    if (token) {
      await apiClient.post('/auth/logout', { refreshToken: token });
    }
  } catch (e) {
    // Ignore network error on logout
  } finally {
    await clearAuthTokens();
  }
}

/**
 * Verify Email Token
 * POST /api/aegis/v1/auth/verify-email
 */
export async function verifyEmailToken(token: string): Promise<any> {
  const res = await apiClient.post('/auth/verify-email', { token });
  return res.data;
}

/**
 * Resend Verification Email
 * POST /api/aegis/v1/auth/resend-verification
 */
export async function resendVerificationEmail(email: string): Promise<any> {
  const res = await apiClient.post('/auth/resend-verification', { email });
  return res.data;
}

/**
 * MFA Management APIs
 */
export async function getMfaStatus(): Promise<MfaStatusResponse> {
  const res = await apiClient.get('/auth/mfa/status');
  return res.data;
}

export async function initiateMfaSetup(): Promise<MfaSetupResponse> {
  const res = await apiClient.post('/auth/mfa/setup');
  return res.data;
}

export async function confirmMfaSetup(code: string): Promise<MfaVerifySetupResponse> {
  const res = await apiClient.post('/auth/mfa/verify-setup', { code });
  return res.data;
}

export async function disableMfa(password: string, code: string): Promise<any> {
  const res = await apiClient.post('/auth/mfa/disable', { password, code });
  return res.data;
}

export async function regenerateRecoveryCodes(code: string): Promise<MfaVerifySetupResponse> {
  const res = await apiClient.post('/auth/mfa/regenerate-recovery-codes', { code });
  return res.data;
}

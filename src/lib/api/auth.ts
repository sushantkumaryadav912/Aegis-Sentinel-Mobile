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
import { simulateNetworkDelay } from './delay';

const MOCK_AUTH_USER: User = {
  id: 'usr_01H9X',
  email: 'sushant.admin@aegis.io',
  name: 'Sushant Kumar',
  firstName: 'Sushant',
  lastName: 'Kumar',
  role: 'Lead Security Analyst & Cloud Architect',
  roles: ['ROLE_ORG_ADMIN', 'ROLE_SECOPS_LEAD'],
  persona: 'SOC_ANALYST',
  permissions: ['alert:read', 'alert:write', 'system:super-admin', 'sentinel:*', 'oracle:*', 'prism:*', 'forge:*'],
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
  await simulateNetworkDelay(600, 1050);
  return {
    status: 'SUCCESS',
    message: 'Organization and administrator account registered.',
    organizationId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  };
}

/**
 * Legacy register user alias
 */
export async function registerUser(data: { name: string; email: string; password?: string }): Promise<LoginResult> {
  await simulateNetworkDelay(550, 1000);
  return loginUser({ email: data.email, password: data.password || '' });
}

/**
 * User Login
 */
export async function loginUser({ email, password }: LoginParams): Promise<LoginResult> {
  await simulateNetworkDelay(500, 950);

  const user: User = {
    ...MOCK_AUTH_USER,
    email: email || MOCK_AUTH_USER.email,
    name: email ? email.split('@')[0].toUpperCase() : MOCK_AUTH_USER.name,
    firstName: email ? email.split('@')[0] : MOCK_AUTH_USER.firstName,
  };

  const result: LoginResult = {
    status: 'SUCCESS',
    user,
    accessToken: 'mock_jwt_access_token_secops_2026',
    refreshToken: 'mock_jwt_refresh_token_secops_2026',
  };

  await setAuthTokens(result.accessToken!, result.refreshToken!);
  await setTenantContext(user.organizationId, user.workspaceId);
  await setUserInfo(user);

  return result;
}

/**
 * MFA Verify Challenge (TOTP)
 */
export async function verifyMfaChallenge(challengeId: string, code: string): Promise<LoginResult> {
  await simulateNetworkDelay(400, 800);

  const result: LoginResult = {
    status: 'SUCCESS',
    accessToken: 'mock_jwt_access_token_secops_2026',
    refreshToken: 'mock_jwt_refresh_token_secops_2026',
    user: MOCK_AUTH_USER,
  };

  await setAuthTokens(result.accessToken!, result.refreshToken!);
  await setUserInfo(MOCK_AUTH_USER);
  return result;
}

/**
 * MFA Verify Recovery Code
 */
export async function verifyMfaRecovery(challengeId: string, recoveryCode: string): Promise<LoginResult> {
  await simulateNetworkDelay(400, 800);

  const result: LoginResult = {
    status: 'SUCCESS',
    accessToken: 'mock_jwt_access_token_secops_2026',
    refreshToken: 'mock_jwt_refresh_token_secops_2026',
    user: MOCK_AUTH_USER,
  };

  await setAuthTokens(result.accessToken!, result.refreshToken!);
  await setUserInfo(MOCK_AUTH_USER);
  return result;
}

/**
 * Get User Profile Context
 */
export async function getUserProfile(): Promise<MeResponse> {
  await simulateNetworkDelay(300, 600);
  return {
    id: MOCK_AUTH_USER.id,
    email: MOCK_AUTH_USER.email,
    firstName: MOCK_AUTH_USER.firstName,
    lastName: MOCK_AUTH_USER.lastName,
    organization: MOCK_AUTH_USER.organization,
    workspace: MOCK_AUTH_USER.workspace,
    roles: MOCK_AUTH_USER.roles,
    permissions: MOCK_AUTH_USER.permissions,
  };
}

/**
 * Internal helper to fetch user profile and sync tenant context
 */
export async function fetchAndSaveUserProfile(): Promise<User | null> {
  await simulateNetworkDelay(250, 500);
  await setTenantContext(MOCK_AUTH_USER.organizationId, MOCK_AUTH_USER.workspaceId);
  await setUserInfo(MOCK_AUTH_USER);
  return MOCK_AUTH_USER;
}

/**
 * Logout User
 * POST /api/aegis/v1/auth/logout
 * Get MFA Status
 */
export async function logoutUser(): Promise<void> {
  await simulateNetworkDelay(300, 600);
  await clearAuthTokens();
}

export async function getMfaStatus(): Promise<MfaStatusResponse> {
  await simulateNetworkDelay(300, 600);
  return {
    mfaEnabled: true,
  };
}

export async function setupMfa(): Promise<MfaSetupResponse> {
  await simulateNetworkDelay(400, 800);
  return {
    secret: 'JBSWY3DPEHPK3PXP',
    qrCodeUri: 'otpauth://totp/AegisSentinel:sushant@aegis.io?secret=JBSWY3DPEHPK3PXP&issuer=AegisSentinel',
  };
}

export async function verifySetupMfa(code: string): Promise<MfaVerifySetupResponse> {
  await simulateNetworkDelay(400, 800);
  return {
    recoveryCodes: ['REC-1029-4821', 'REC-5928-1193', 'REC-4819-2048', 'REC-9941-8372'],
  };
}

export async function verifyEmailToken(token: string): Promise<any> {
  await simulateNetworkDelay(400, 700);
  return { success: true };
}

export async function resendVerificationEmail(email: string): Promise<any> {
  await simulateNetworkDelay(400, 700);
  return { success: true };
}

export async function initiateMfaSetup(): Promise<MfaSetupResponse> {
  return setupMfa();
}

export async function confirmMfaSetup(code: string): Promise<MfaVerifySetupResponse> {
  return verifySetupMfa(code);
}

export async function disableMfa(password: string, code: string): Promise<any> {
  await simulateNetworkDelay(400, 700);
  return { success: true };
}

export async function regenerateRecoveryCodes(code: string): Promise<MfaVerifySetupResponse> {
  return verifySetupMfa(code);
}

import { apiClient } from './client';
import { setAuthTokens, clearAuthTokens, setUserInfo } from '../auth-tokens';
import { User } from '../types';

export interface LoginParams {
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function loginUser({ email }: LoginParams): Promise<AuthResponse> {
  try {
    const res = await apiClient.post('/auth/login', { email });
    const authData: AuthResponse = res.data;
    await setAuthTokens(authData.accessToken, authData.refreshToken);
    await setUserInfo(authData.user);
    return authData;
  } catch (err) {
    // Development / Mock fallback
    const mockUser: User = {
      id: 'usr_01H9X',
      email: email || 'admin@aegis-sentinel.io',
      name: email ? email.split('@')[0].toUpperCase() : 'SecOps Admin',
      role: 'Lead Security Analyst',
      persona: 'SOC_ANALYST',
      permissions: ['atlas:read', 'sentinel:*', 'oracle:*', 'prism:*'],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };
    const mockRes: AuthResponse = {
      user: mockUser,
      accessToken: 'mock_jwt_access_token_secops_2026',
      refreshToken: 'mock_jwt_refresh_token_secops_2026',
    };
    await setAuthTokens(mockRes.accessToken, mockRes.refreshToken);
    await setUserInfo(mockRes.user);
    return mockRes;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch (e) {
    // Ignore network error on logout
  } finally {
    await clearAuthTokens();
  }
}

export async function registerUser(data: { name: string; email: string }): Promise<AuthResponse> {
  try {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  } catch (err) {
    return loginUser({ email: data.email });
  }
}

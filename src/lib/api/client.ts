import axios from 'axios';
import Constants from 'expo-constants';
import { getAccessToken, getRefreshToken, getOrgId, getWorkspaceId, setAuthTokens, clearAuthTokens } from '../auth-tokens';

const API_HOST = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8080';
export const BASE_URL = API_HOST.endsWith('/api/aegis/v1') 
  ? API_HOST 
  : `${API_HOST.replace(/\/$/, '')}/api/aegis/v1`;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const orgId = await getOrgId();
  if (orgId) {
    config.headers['X-Organization-Id'] = orgId;
  }
  const workspaceId = await getWorkspaceId();
  if (workspaceId) {
    config.headers['X-Workspace-Id'] = workspaceId;
  }
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          if (res.data?.accessToken) {
            await setAuthTokens(res.data.accessToken, res.data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshErr) {
        await clearAuthTokens();
      }
    }
    return Promise.reject(error);
  }
);

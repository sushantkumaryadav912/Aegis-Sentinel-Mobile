import axios from 'axios';
import Constants from 'expo-constants';
import { getAccessToken, getRefreshToken, setAuthTokens, clearAuthTokens } from '../auth-tokens';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'https://api.aegis-sentinel.local/api/cidr';

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

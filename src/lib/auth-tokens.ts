import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'aegis_access_token';
const REFRESH_TOKEN_KEY = 'aegis_refresh_token';
const USER_INFO_KEY = 'aegis_user_info';

export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error reading access token from SecureStore:', error);
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error reading refresh token from SecureStore:', error);
    return null;
  }
}

export async function setAuthTokens(accessToken: string, refreshToken?: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    console.error('Error saving auth tokens to SecureStore:', error);
  }
}

export async function setUserInfo(user: any): Promise<void> {
  try {
    await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user info to SecureStore:', error);
  }
}

export async function getUserInfo(): Promise<any | null> {
  try {
    const data = await SecureStore.getItemAsync(USER_INFO_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

export async function clearAuthTokens(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_INFO_KEY);
  } catch (error) {
    console.error('Error clearing auth tokens from SecureStore:', error);
  }
}

export async function hasRefreshToken(): Promise<boolean> {
  const token = await getRefreshToken();
  return !!token;
}

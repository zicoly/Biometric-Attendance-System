import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "student_access_token";
const REFRESH_KEY = "student_refresh_token";
const USER_KEY = "student_user_data";

// Save access + refresh tokens
export const saveTokens = async (
  token: string,
  refreshToken: string,
): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
};

// Retrieve access token
export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

// Retrieve refresh token
export const getRefreshToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(REFRESH_KEY);
};

// Save user data as JSON string
export const saveUser = async (user: object): Promise<void> => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

// Retrieve user data
export const getUser = async (): Promise<any | null> => {
  const data = await SecureStore.getItemAsync(USER_KEY);
  return data ? JSON.parse(data) : null;
};

// Clear all auth data on logout
export const clearAuth = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
};

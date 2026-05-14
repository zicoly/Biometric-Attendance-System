// student-app/src/utils/secureStore.ts
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const DEVICE_ID_KEY = 'device_id';
const PRIVATE_KEY_KEY = 'private_key';

// Web fallback for testing
const webStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key),
};

const isWeb = Platform.OS === 'web';

export const secureStore = {
  async setToken(token: string): Promise<void> {
    if (isWeb) {
      webStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  },

  async getToken(): Promise<string | null> {
    if (isWeb) {
      return webStorage.getItem(TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async removeToken(): Promise<void> {
    if (isWeb) {
      webStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    if (isWeb) {
      webStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    if (isWeb) {
      return webStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async setDeviceId(deviceId: string): Promise<void> {
    if (isWeb) {
      webStorage.setItem(DEVICE_ID_KEY, deviceId);
    } else {
      await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
    }
  },

  async getDeviceId(): Promise<string | null> {
    if (isWeb) {
      return webStorage.getItem(DEVICE_ID_KEY);
    }
    return await SecureStore.getItemAsync(DEVICE_ID_KEY);
  },

  async setPrivateKey(key: string): Promise<void> {
    if (isWeb) {
      webStorage.setItem(PRIVATE_KEY_KEY, key);
    } else {
      await SecureStore.setItemAsync(PRIVATE_KEY_KEY, key);
    }
  },

  async getPrivateKey(): Promise<string | null> {
    if (isWeb) {
      return webStorage.getItem(PRIVATE_KEY_KEY);
    }
    return await SecureStore.getItemAsync(PRIVATE_KEY_KEY);
  },

  async clearAll(): Promise<void> {
    if (isWeb) {
      webStorage.removeItem(TOKEN_KEY);
      webStorage.removeItem(REFRESH_TOKEN_KEY);
      webStorage.removeItem(DEVICE_ID_KEY);
      webStorage.removeItem(PRIVATE_KEY_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(DEVICE_ID_KEY);
      await SecureStore.deleteItemAsync(PRIVATE_KEY_KEY);
    }
  },
};
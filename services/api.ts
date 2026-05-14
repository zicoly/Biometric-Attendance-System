// student-app/src/services/api.ts
import axios from "axios";
import { secureStore } from "../utils/secureStore";
import { Platform } from "react-native";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://awwal-ams-backend.vercel.app/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await secureStore.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await secureStore.clearAll();
      // Navigate to login screen (handled by auth store)
    }
    return Promise.reject(error);
  },
);

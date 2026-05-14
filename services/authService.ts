// student-app/src/services/authService.ts
import { api } from "./api";
import { secureStore } from "../utils/secureStore";
import { User, AuthResponse } from "../types/student.types";

interface RegisterData {
  fullName: string;
  matricNumber: string;
  email: string;
  password: string;
  department: string;
  level: number;
}

interface LoginData {
  emailOrMatric: string;
  password: string;
}

const unwrap = (raw: any) => raw?.data ?? raw;

export const authService = {
  async register(
    data: RegisterData,
  ): Promise<{ user: User; accessToken: string }> {
    const response = await api.post("/auth/register", {
      ...data,
      role: "student",
    });
    const unwrapped = unwrap(response.data);
    const user = unwrapped.user;
    const accessToken = unwrapped.tokens?.accessToken;
    const refreshToken = unwrapped.tokens?.refreshToken;

    if (accessToken) {
      await secureStore.setToken(accessToken);
    }
    if (refreshToken) {
      await secureStore.setRefreshToken(refreshToken);
    }

    return { user, accessToken };
  },

  async login(data: LoginData): Promise<{ user: User; accessToken: string }> {
    const response = await api.post("/auth/login", data);
    const unwrapped = unwrap(response.data);
    const user = unwrapped.user;
    const accessToken = unwrapped.tokens?.accessToken;
    const refreshToken = unwrapped.tokens?.refreshToken;

    if (accessToken) {
      await secureStore.setToken(accessToken);
    }
    if (refreshToken) {
      await secureStore.setRefreshToken(refreshToken);
    }

    return { user, accessToken };
  },

  async getMe(): Promise<User> {
    const response = await api.get("/auth/me");
    const unwrapped = unwrap(response.data);
    return unwrapped;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Ignore logout errors
    } finally {
      await secureStore.clearAll();
    }
  },
};

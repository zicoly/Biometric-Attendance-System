// student-app/src/store/authStore.ts
import { create } from "zustand";
import { authService } from "../services/authService";
import { studentService } from "../services/studentService";
import { secureStore } from "../utils/secureStore";
import { User } from "../types/student.types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEnrolled: boolean;
  error: string | null;

  login: (emailOrMatric: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  checkEnrollment: () => Promise<boolean>;
  setEnrolled: (enrolled: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isEnrolled: false,
  error: null,

  login: async (emailOrMatric, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.login({ emailOrMatric, password });
      set({ user, isAuthenticated: true, isLoading: false });

      // Check enrollment after login
      await get().checkEnrollment();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.register(data);
      set({ user, isAuthenticated: true, isLoading: false });

      // New users are not enrolled yet
      set({ isEnrolled: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      isEnrolled: false,
      isLoading: false,
      error: null,
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await secureStore.getToken();
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      const user = await authService.getMe();
      set({ user, isAuthenticated: true, isLoading: false });

      // Check enrollment
      await get().checkEnrollment();
    } catch (error) {
      await secureStore.clearAll();
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        isEnrolled: false,
      });
    }
  },

  checkEnrollment: async () => {
    try {
      const courses = await studentService.getMyEnrolledCourses();
      const isEnrolled = courses.length > 0;
      set({ isEnrolled });
      return isEnrolled;
    } catch (error) {
      set({ isEnrolled: false });
      return false;
    }
  },

  setEnrolled: (enrolled) => {
    set({ isEnrolled: enrolled });
  },
}));

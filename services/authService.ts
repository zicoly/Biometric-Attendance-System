import api from "./api";
import {
  StudentSignupPayload,
  StudentLoginPayload,
  AuthResponse,
} from "../types/student.types";

/**
 * Register a new student account.
 * POST /api/students/auth/signup
 */
export const studentSignup = async (
  data: StudentSignupPayload,
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    "/students/auth/signup",
    data,
  );
  return response.data;
};

/**
 * Login with email/matric + password.
 * POST /api/students/auth/login
 * Returns: JWT access token, refresh token, and student profile.
 */
export const studentLogin = async (
  data: StudentLoginPayload,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/students/auth/login", data);
  return response.data;
};

/**
 * Logout — invalidates token on the server.
 * POST /api/students/auth/logout
 */
export const studentLogout = async (): Promise<void> => {
  await api.post("/students/auth/logout");
};

/**
 * Fetch the currently authenticated student's profile.
 * GET /api/students/me
 * Useful to restore session on app start.
 */
export const getStudentProfile = async (): Promise<AuthResponse["student"]> => {
  const response = await api.get<AuthResponse["student"]>("/students/me");
  return response.data;
};

/**
 * Refresh the access token using the refresh token.
 * POST /api/students/auth/refresh
 */
export const refreshAccessToken = async (
  refreshToken: string,
): Promise<{ token: string }> => {
  const response = await api.post<{ token: string }>("/students/auth/refresh", {
    refreshToken,
  });
  return response.data;
};

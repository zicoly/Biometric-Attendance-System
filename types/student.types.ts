export type StudentLevel = "100" | "200" | "300" | "400" | "500";

export interface StudentSignupPayload {
  fullName: string;
  matricNumber: string;
  email: string;
  department: string;
  level: StudentLevel;
  phone?: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

export interface StudentLoginPayload {
  identifier: string; // email or matric number
  password: string;
  rememberSession: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  student: {
    id: string;
    fullName: string;
    matricNumber: string;
    email: string;
    department: string;
    level: StudentLevel;
    biometricEnabled: boolean;
  };
}

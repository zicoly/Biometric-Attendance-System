export type StudentLevel = "100" | "200" | "300" | "400" | "500";

// student-app/src/types/student.types.ts
export interface User {
  createdAt: string | number | Date;
  _id: string;
  fullName: string;
  matricNumber: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin';
  department: string;
  level: number;
  biometricEnabled: boolean;
  registeredDevices?: RegisteredDevice[];
}

export interface RegisteredDevice {
  deviceId: string;
  deviceName: string;
  addedAt: string;
}

export interface Course {
  _id: string;
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  department: string;
  level: number;
  lecturerId: {
    fullName: string;
    _id: string;
  };
  isEnrolled?: boolean;
}

export interface EnrolledCourse {
  _id: string;
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  lecturer: string;
  attendanceRate: number;
  totalSessions: number;
  attendedSessions: number;
}

export interface Session {
  _id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  startTime: string;
  endTime: string;
  sessionCode?: string;
  qrEnabled: boolean;
  status: 'active' | 'ended' | 'scheduled';
  hasMarked: boolean;
  markedAt?: string;
  markedMethod?: 'biometric' | 'qr';
}

export interface AttendanceRecord {
  _id: string;
  sessionId: {
    courseCode: string;
    courseTitle: string;
    startTime: string;
    _id: string;
  };
  timestamp: string;
  method: 'biometric' | 'qr' | 'offline';
}

export interface AttendanceHistoryResponse {
  records: AttendanceRecord[];
  stats: {
    totalAttendance: number;
    byMethod: Array<{ _id: string; count: number }>;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BiometricChallenge {
  challenge: string;
  expiresAt: string;
}

export interface OfflineRecord {
  id: string;
  sessionId: string;
  timestamp: string;
  deviceId: string;
  signature?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  attemptCount: number;
  status: 'pending' | 'synced' | 'failed';
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface ApiError {
  status: string;
  message: string;
}
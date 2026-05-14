// student-app/src/services/studentService.ts
import { api } from "./api";
import {
  Course,
  EnrolledCourse,
  Session,
  AttendanceHistoryResponse,
  BiometricChallenge,
  OfflineRecord,
} from "../types/student.types";

const unwrap = (raw: any) => raw?.data ?? raw;

export const studentService = {
  // ─── Enrollment ─────────────────────────────────────────────

  async getAvailableCourses(): Promise<Course[]> {
    const response = await api.get("/enrollment/available-courses");
    const data = unwrap(response.data);
    return data?.courses ?? [];
  },

  async submitEnrollment(courseIds: string[]): Promise<void> {
    await api.post("/enrollment/submit", {
      courseIds,
      confirmations: {
        readWarning: true,
        understandIrreversible: true,
      },
    });
  },

  async getMyEnrolledCourses(): Promise<EnrolledCourse[]> {
    const response = await api.get("/enrollment/my-courses");
    const data = unwrap(response.data);
    return data?.courses ?? [];
  },

  // ─── Sessions ────────────────────────────────────────────────

  async getActiveSessions(): Promise<Session[]> {
    const response = await api.get("/sessions/student/active");
    const data = unwrap(response.data);
    return data?.sessions ?? [];
  },

  async getUpcomingSessions(): Promise<Session[]> {
    const response = await api.get("/sessions/student/upcoming");
    const data = unwrap(response.data);
    return data?.sessions ?? [];
  },

  async getSessionHistory(page = 1, limit = 20): Promise<Session[]> {
    const response = await api.get("/sessions/student/history", {
      params: { page, limit },
    });
    const data = unwrap(response.data);
    return data?.sessions ?? [];
  },

  async validateSession(sessionId: string): Promise<{
    isValid: boolean;
    message: string;
    canMark: boolean;
  }> {
    const response = await api.get(`/sessions/student/${sessionId}/validate`);
    return unwrap(response.data);
  },

  // ─── Biometrics ─────────────────────────────────────────────

  async registerDevice(
    deviceId: string,
    deviceName: string,
    publicKey: string,
  ): Promise<void> {
    await api.post("/biometric/register-device", {
      deviceId,
      deviceName,
      publicKey,
    });
  },

  async getRegisteredDevices(): Promise<
    Array<{ deviceId: string; deviceName: string; addedAt: string }>
  > {
    const response = await api.get("/biometric/devices");
    const data = unwrap(response.data);
    return data?.registeredDevices ?? [];
  },

  async getBiometricChallenge(deviceId: string): Promise<BiometricChallenge> {
    const response = await api.get("/biometric/challenge", {
      params: { deviceId },
    });
    return unwrap(response.data);
  },

  // ─── Attendance Marking ─────────────────────────────────────

  async markBiometricAttendance(
    sessionId: string,
    deviceId: string,
    signature: string,
    timestamp: string,
    location?: { latitude: number; longitude: number },
  ): Promise<void> {
    await api.post("/attendance/mark/biometric", {
      sessionId,
      deviceId,
      signature,
      timestamp,
      location,
    });
  },

  async markQRAttendance(
    qrToken: string,
    timestamp: string,
    location?: { latitude: number; longitude: number },
  ): Promise<void> {
    await api.post("/attendance/mark/qr", {
      qrToken,
      timestamp,
      location,
    });
  },

  async getAttendanceHistory(params?: {
    page?: number;
    limit?: number;
    courseId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AttendanceHistoryResponse> {
    const response = await api.get("/attendance/history", { params });
    return unwrap(response.data);
  },

  // ─── Offline ─────────────────────────────────────────────────

  async saveOfflineAttendance(
    record: Omit<OfflineRecord, "id" | "attemptCount" | "status">,
  ): Promise<{ queueId: string }> {
    const response = await api.post("/offline/save", record);
    return unwrap(response.data);
  },

  async getPendingOfflineRecords(): Promise<{
    count: number;
    records: OfflineRecord[];
  }> {
    const response = await api.get("/offline/pending");
    return unwrap(response.data);
  },

  async syncOfflineRecords(records: OfflineRecord[]): Promise<{
    syncedCount: number;
    duplicateCount: number;
    failedCount: number;
  }> {
    const response = await api.post("/offline/sync", { records });
    return unwrap(response.data);
  },

  async getOfflineCache(): Promise<{
    cachedAt: string;
    sessions: Session[];
    recentAttendance: AttendanceHistoryResponse["records"];
  }> {
    const response = await api.get("/offline/cache");
    return unwrap(response.data);
  },
};

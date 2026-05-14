import { api } from "./api";

interface AttendanceResult {
  message: string;
  timestamp: string;
  sessionId: string;
}

export const markAttendance = async (): Promise<AttendanceResult> => {
  const response = await api.post<AttendanceResult>("/attendance/mark");
  return response.data;
};

export const getAttendanceHistory = async (page = 1, limit = 20) => {
  const response = await api.get(
    `/attendance/history?page=${page}&limit=${limit}`,
  );
  return response.data;
};

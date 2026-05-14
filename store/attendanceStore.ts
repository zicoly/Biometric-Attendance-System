// student-app/src/store/attendanceStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { studentService } from "../services/studentService";
import { OfflineRecord } from "../types/student.types";

interface AttendanceState {
  offlineQueue: OfflineRecord[];
  isSyncing: boolean;

  addToQueue: (
    record: Omit<OfflineRecord, "id" | "attemptCount" | "status">,
  ) => Promise<void>;
  removeFromQueue: (id: string) => Promise<void>;
  syncQueue: () => Promise<void>;
  loadQueue: () => Promise<void>;
}

const QUEUE_KEY = "@attendance_offline_queue";

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  offlineQueue: [],
  isSyncing: false,

  addToQueue: async (record) => {
    const newRecord: OfflineRecord = {
      ...record,
      id: `offline_${Date.now()}_${Math.random()}`,
      attemptCount: 0,
      status: "pending",
    };

    const currentQueue = get().offlineQueue;
    const updatedQueue = [...currentQueue, newRecord];

    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
    set({ offlineQueue: updatedQueue });
  },

  removeFromQueue: async (id) => {
    const currentQueue = get().offlineQueue;
    const updatedQueue = currentQueue.filter((r) => r.id !== id);

    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
    set({ offlineQueue: updatedQueue });
  },

  syncQueue: async () => {
    const { offlineQueue, isSyncing } = get();

    if (isSyncing || offlineQueue.length === 0) return;

    set({ isSyncing: true });

    try {
      const pendingRecords = offlineQueue.filter((r) => r.status === "pending");

      if (pendingRecords.length === 0) {
        set({ isSyncing: false });
        return;
      }

      const result = await studentService.syncOfflineRecords(pendingRecords);

      // Remove successfully synced records
      const updatedQueue = offlineQueue.filter((r) => {
        // Keep records that weren't synced or failed
        const wasSynced = pendingRecords.some((p) => p.id === r.id);
        return !wasSynced;
      });

      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
      set({ offlineQueue: updatedQueue, isSyncing: false });
    } catch (error) {
      console.error("[Sync] Failed to sync offline queue:", error);
      set({ isSyncing: false });
    }
  },

  loadQueue: async () => {
    try {
      const queueJson = await AsyncStorage.getItem(QUEUE_KEY);
      const queue = queueJson ? JSON.parse(queueJson) : [];
      set({ offlineQueue: queue });
    } catch (error) {
      console.error("[Queue] Failed to load queue:", error);
      set({ offlineQueue: [] });
    }
  },
}));

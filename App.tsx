// student-app/App.tsx
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { RootNavigator } from "./navigation/RootNavigator";
import { useAttendanceStore } from "./store/attendanceStore";

export default function App() {
  // Initialize offline queue on app start
  React.useEffect(() => {
    useAttendanceStore.getState().loadQueue();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}

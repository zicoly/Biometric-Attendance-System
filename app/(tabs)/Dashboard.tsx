import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useBiometric } from "../../hooks/useBiometric";
import { useAuth } from "../../store/authStore";
import { markAttendance } from "../../services/attendanceService";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isAvailable, isEnrolled, authenticate } = useBiometric();
  const [marking, setMarking] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleMarkAttendance = async () => {
    setMarking(true);
    try {
      // If biometric available, require verification first
      if (isAvailable && isEnrolled) {
        const verified = await authenticate();
        if (!verified) {
          Alert.alert(
            "Verification Failed",
            "Biometric verification required to mark attendance.",
          );
          setMarking(false);
          return;
        }
      }
      // Call the attendance API
      const result = await markAttendance();
      setLastAction(`Attendance marked at ${new Date().toLocaleTimeString()}`);
      Alert.alert(
        "✅ Success",
        result.message || "Attendance marked successfully!",
      );
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to mark attendance.",
      );
    } finally {
      setMarking(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good {getTimeOfDay()} 👋</Text>
          <Text style={styles.name}>{user?.fullName || "Student"}</Text>
          <Text style={styles.meta}>
            {user?.matricNumber} · {user?.department}
          </Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{user?.level}L</Text>
        </View>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.cardTitle}>Today's Status</Text>
        <Text style={styles.statusValue}>Not Marked</Text>
        <Text style={styles.statusDate}>{new Date().toDateString()}</Text>
      </View>

      {/* Mark Attendance Button */}
      <TouchableOpacity
        style={[styles.markButton, marking && styles.disabled]}
        onPress={handleMarkAttendance}
        disabled={marking}
        activeOpacity={0.85}
      >
        {marking ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <>
            <Text style={styles.markIcon}>👆</Text>
            <Text style={styles.markText}>Mark Attendance</Text>
            {isAvailable && isEnrolled && (
              <Text style={styles.markSubText}>
                Biometric verification required
              </Text>
            )}
          </>
        )}
      </TouchableOpacity>

      {lastAction && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>✅ {lastAction}</Text>
        </View>
      )}

      {/* Offline Indicator */}
      <View style={styles.offlineCard}>
        <Text style={styles.offlineIcon}>🟢</Text>
        <Text style={styles.offlineText}>Connected to server</Text>
      </View>
    </ScrollView>
  );
};

const getTimeOfDay = () => {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    backgroundColor: "#1e3a8a",
    padding: 24,
    paddingTop: 60,
    paddingBottom: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: { color: "#93c5fd", fontSize: 14, marginBottom: 4 },
  name: { color: "#fff", fontSize: 22, fontWeight: "800" },
  meta: { color: "#93c5fd", fontSize: 12, marginTop: 4 },
  levelBadge: { backgroundColor: "#3b82f6", borderRadius: 12, padding: 12 },
  levelText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  statusCard: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardTitle: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  statusValue: { color: "#f59e0b", fontSize: 20, fontWeight: "800" },
  statusDate: { color: "#94a3b8", fontSize: 12, marginTop: 4 },
  markButton: {
    backgroundColor: "#2563eb",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  disabled: { opacity: 0.6 },
  markIcon: { fontSize: 44, marginBottom: 12 },
  markText: { color: "#fff", fontSize: 20, fontWeight: "800" },
  markSubText: { color: "#93c5fd", fontSize: 12, marginTop: 6 },
  successBanner: {
    margin: 20,
    backgroundColor: "#dcfce7",
    borderRadius: 12,
    padding: 14,
  },
  successText: { color: "#16a34a", fontSize: 13, fontWeight: "600" },
  offlineCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 20,
    marginTop: 0,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  offlineIcon: { fontSize: 14 },
  offlineText: { color: "#64748b", fontSize: 13 },
});

export default Dashboard;

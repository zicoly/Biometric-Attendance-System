// student-app/src/screens/main/DashboardScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { studentService } from "../../services/studentService";
import { useAuthStore } from "../../store/authStore";
import {
  EnrolledCourse,
  AttendanceHistoryResponse,
} from "../../types/student.types";

export const DashboardScreen: React.FC = () => {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<
    AttendanceHistoryResponse["stats"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthStore();

  const loadData = useCallback(async () => {
    try {
      const [enrolledCourses, history] = await Promise.all([
        studentService.getMyEnrolledCourses(),
        studentService.getAttendanceHistory({ limit: 100 }),
      ]);

      setCourses(enrolledCourses);
      setAttendanceStats(history.stats);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const overallAttendanceRate =
    courses.length > 0
      ? (
          courses.reduce((sum, c) => sum + c.attendanceRate, 0) / courses.length
        ).toFixed(1)
      : "0";

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#2563eb"]}
        />
      }
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>
            {user?.fullName?.split(" ")[0] || "Student"}
          </Text>
          <Text style={styles.matricNumber}>{user?.matricNumber}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.fullName?.charAt(0) || "S"}
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{courses.length}</Text>
          <Text style={styles.statLabel}>Enrolled Courses</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {attendanceStats?.totalAttendance || 0}
          </Text>
          <Text style={styles.statLabel}>Total Attendance</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{overallAttendanceRate}%</Text>
          <Text style={styles.statLabel}>Overall Rate</Text>
        </View>
      </View>

      {/* Attendance by Method */}
      {attendanceStats && attendanceStats.byMethod.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Methods</Text>
          <View style={styles.methodsContainer}>
            {attendanceStats.byMethod.map((method) => (
              <View key={method._id} style={styles.methodCard}>
                <Text style={styles.methodIcon}>
                  {method._id === "biometric"
                    ? "🔐"
                    : method._id === "qr"
                      ? "📱"
                      : "📴"}
                </Text>
                <Text style={styles.methodName}>
                  {method._id === "biometric"
                    ? "Biometric"
                    : method._id === "qr"
                      ? "QR Code"
                      : "Offline"}
                </Text>
                <Text style={styles.methodCount}>{method.count}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Enrolled Courses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Courses</Text>
        {courses.length === 0 ? (
          <View style={styles.emptyCourses}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyText}>No courses enrolled yet</Text>
          </View>
        ) : (
          courses.map((course) => (
            <View key={course._id} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <Text style={styles.courseCode}>{course.courseCode}</Text>
                <Text style={styles.creditUnits}>
                  {course.creditUnits} credits
                </Text>
              </View>
              <Text style={styles.courseTitle}>{course.courseTitle}</Text>
              <Text style={styles.lecturer}>Lecturer: {course.lecturer}</Text>

              <View style={styles.attendanceRow}>
                <Text style={styles.attendanceLabel}>Attendance:</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${course.attendanceRate}%` },
                      course.attendanceRate >= 75
                        ? styles.progressGood
                        : course.attendanceRate >= 50
                          ? styles.progressWarning
                          : styles.progressBad,
                    ]}
                  />
                </View>
                <Text style={styles.attendanceRate}>
                  {course.attendanceRate}%
                </Text>
              </View>
              <Text style={styles.sessionCount}>
                {course.attendedSessions} / {course.totalSessions} sessions
                attended
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#2563eb",
    padding: 24,
    paddingTop: 48,
    paddingBottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 14,
    color: "#bfdbfe",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },
  matricNumber: {
    fontSize: 12,
    color: "#bfdbfe",
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
  },
  statsGrid: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    marginTop: -20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  methodsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  methodCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  methodIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  methodName: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  methodCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  emptyCourses: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563eb",
  },
  creditUnits: {
    fontSize: 12,
    color: "#64748b",
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 4,
  },
  lecturer: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 12,
  },
  attendanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  attendanceLabel: {
    fontSize: 12,
    color: "#64748b",
    width: 70,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressGood: {
    backgroundColor: "#22c55e",
  },
  progressWarning: {
    backgroundColor: "#f59e0b",
  },
  progressBad: {
    backgroundColor: "#ef4444",
  },
  attendanceRate: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e293b",
    width: 40,
    textAlign: "right",
  },
  sessionCount: {
    fontSize: 11,
    color: "#64748b",
    marginLeft: 70,
  },
});

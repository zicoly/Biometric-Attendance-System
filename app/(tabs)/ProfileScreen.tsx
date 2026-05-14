// student-app/src/screens/main/ProfileScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import { useBiometric } from "../../hooks/useBiometric";

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuthStore();
  const {
    isAvailable,
    isRegistered,
    isLoading,
    checkBiometricAvailability,
    checkDeviceRegistration,
    registerDevice,
  } = useBiometric();

  const [biometricStatus, setBiometricStatus] = useState<
    "checking" | "available" | "unavailable" | "registered" | "not_registered"
  >("checking");

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    const available = await checkBiometricAvailability();
    if (!available) {
      setBiometricStatus("unavailable");
      return;
    }

    const registered = await checkDeviceRegistration();
    setBiometricStatus(registered ? "registered" : "not_registered");
  };

  const handleSetupBiometric = async () => {
    if (biometricStatus === "registered") {
      Alert.alert(
        "Already Setup",
        "Biometric authentication is already configured",
      );
      return;
    }

    const result = await registerDevice();
    if (result.success) {
      setBiometricStatus("registered");
      Alert.alert("Success", "Biometric authentication setup complete!");
    } else {
      Alert.alert(
        "Setup Failed",
        result.error || "Could not setup biometric authentication",
      );
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.fullName?.charAt(0) || "S"}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.fullName}</Text>
        <Text style={styles.userDetail}>{user?.matricNumber}</Text>
        <Text style={styles.userDetail}>{user?.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {user?.department} • Level {user?.level}
          </Text>
        </View>
      </View>

      {/* Biometric Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔐 Biometric Authentication</Text>

        {biometricStatus === "checking" && (
          <View style={styles.biometricCard}>
            <ActivityIndicator size="small" color="#2563eb" />
            <Text style={styles.biometricText}>
              Checking biometric status...
            </Text>
          </View>
        )}

        {biometricStatus === "unavailable" && (
          <View style={[styles.biometricCard, styles.biometricUnavailable]}>
            <Text style={styles.biometricIcon}>❌</Text>
            <Text style={styles.biometricTitle}>Not Available</Text>
            <Text style={styles.biometricDescription}>
              Your device does not support biometric authentication. You can
              still use QR codes to mark attendance.
            </Text>
          </View>
        )}

        {biometricStatus === "registered" && (
          <View style={[styles.biometricCard, styles.biometricRegistered]}>
            <Text style={styles.biometricIcon}>✅</Text>
            <Text style={styles.biometricTitle}>Biometric Enabled</Text>
            <Text style={styles.biometricDescription}>
              You can use fingerprint or face recognition to mark attendance.
            </Text>
          </View>
        )}

        {biometricStatus === "not_registered" && (
          <View style={[styles.biometricCard, styles.biometricNotRegistered]}>
            <Text style={styles.biometricIcon}>⚠️</Text>
            <Text style={styles.biometricTitle}>Not Set Up</Text>
            <Text style={styles.biometricDescription}>
              Enable biometric authentication for faster attendance marking.
            </Text>
            <TouchableOpacity
              style={styles.setupButton}
              onPress={handleSetupBiometric}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.setupButtonText}>Setup Biometric</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Account Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Account Information</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>Student</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>{user?.department}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Level</Text>
            <Text style={styles.infoValue}>{user?.level}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account Created</Text>
            <Text style={styles.infoValue}>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ About</Text>

        <View style={styles.infoCard}>
          <Text style={styles.versionText}>
            Biometric Attendance System v1.0.0
          </Text>
          <Text style={styles.copyrightText}>
            © 2024 University Attendance System
          </Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2563eb",
    padding: 24,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2563eb",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 14,
    color: "#bfdbfe",
    marginBottom: 2,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  badgeText: {
    fontSize: 12,
    color: "#fff",
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
  biometricCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  biometricUnavailable: {
    backgroundColor: "#fef2f2",
  },
  biometricRegistered: {
    backgroundColor: "#f0fdf4",
  },
  biometricNotRegistered: {
    backgroundColor: "#fef3c7",
  },
  biometricIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  biometricTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  biometricDescription: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 12,
  },
  biometricText: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
  },
  setupButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  setupButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },
  versionText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  footer: {
    height: 32,
  },
});

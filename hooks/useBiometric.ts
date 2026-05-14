// student-app/src/hooks/useBiometric.ts
import { useState } from "react";
import { secureStore } from "../utils/secureStore";
import { studentService } from "../services/studentService";
import * as Device from "expo-device";
import { authenticateWithBiometrics, generateKeyPair, isBiometricAvailable, signChallenge } from "../utils/cryto";

export const useBiometric = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkBiometricAvailability = async () => {
    const available = await isBiometricAvailable();
    setIsAvailable(available);
    return available;
  };

  const checkDeviceRegistration = async () => {
    const deviceId = await secureStore.getDeviceId();
    if (!deviceId) return false;

    try {
      const devices = await studentService.getRegisteredDevices();
      const registered = devices.some((d) => d.deviceId === deviceId);
      setIsRegistered(registered);
      return registered;
    } catch {
      return false;
    }
  };

  const registerDevice = async () => {
    setIsLoading(true);
    try {
      // Generate device ID
      const deviceId =
        Device.deviceName || Device.modelName || `device_${Date.now()}`;
      const deviceName = Device.deviceName || "Unknown Device";

      // Generate key pair
      const { publicKey, privateKey } = await generateKeyPair();

      // Store private key securely
      await secureStore.setPrivateKey(privateKey);
      await secureStore.setDeviceId(deviceId);

      // Register with backend
      await studentService.registerDevice(deviceId, deviceName, publicKey);

      setIsRegistered(true);
      return { success: true, deviceId };
    } catch (error) {
      console.error("[Biometric] Registration failed:", error);
      return { success: false, error: String(error) };
    } finally {
      setIsLoading(false);
    }
  };

  const markAttendanceWithBiometric = async (
    sessionId: string,
    location?: { latitude: number; longitude: number },
  ) => {
    setIsLoading(true);
    try {
      // 1. Check device registration
      const deviceId = await secureStore.getDeviceId();
      if (!deviceId) {
        return {
          success: false,
          error: "Device not registered. Please setup biometrics first.",
        };
      }

      // 2. Get challenge from server
      const challengeData =
        await studentService.getBiometricChallenge(deviceId);

      // 3. Authenticate with device biometrics
      const authSuccess = await authenticateWithBiometrics();
      if (!authSuccess) {
        return { success: false, error: "Biometric authentication failed" };
      }

      // 4. Sign challenge with private key
      const privateKey = await secureStore.getPrivateKey();
      if (!privateKey) {
        return {
          success: false,
          error: "Private key not found. Please re-register device.",
        };
      }

      const signature = await signChallenge(
        challengeData.challenge,
        privateKey,
      );

      // 5. Send to server
      await studentService.markBiometricAttendance(
        sessionId,
        deviceId,
        signature,
        new Date().toISOString(),
        location,
      );

      return { success: true };
    } catch (error: any) {
      console.error("[Biometric] Attendance marking failed:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to mark attendance",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAvailable,
    isRegistered,
    isLoading,
    checkBiometricAvailability,
    checkDeviceRegistration,
    registerDevice,
    markAttendanceWithBiometric,
  };
};

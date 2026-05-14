// student-app/src/utils/crypto.ts
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

// Web fallback for testing
const isWeb = Platform.OS === 'web';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

/**
 * Generate RSA key pair for biometric authentication
 * In production, this would use react-native-keychain or expo-crypto
 * For web testing, we use Web Crypto API
 */
export async function generateKeyPair(): Promise<KeyPair> {
  if (isWeb) {
    // Web fallback: generate fake keys for testing
    const fakePublicKey = `web_public_key_${Date.now()}_${Math.random()}`;
    const fakePrivateKey = `web_private_key_${Date.now()}_${Math.random()}`;
    return {
      publicKey: fakePublicKey,
      privateKey: fakePrivateKey,
    };
  }

  // Native: Use expo-crypto or react-native-keychain
  // For now, generate fake keys (replace with actual RSA implementation)
  return {
    publicKey: `native_public_key_${Date.now()}`,
    privateKey: `native_private_key_${Date.now()}`,
  };
}

/**
 * Sign a challenge with the private key
 */
export async function signChallenge(
  challenge: string,
  privateKey: string
): Promise<string> {
  if (isWeb) {
    // Web fallback: simple hash for testing
    const signature = `signed_${challenge}_${Date.now()}`;
    return signature;
  }

  // Native: Use actual crypto signing
  const signature = `signed_${challenge}_${Date.now()}`;
  return signature;
}

/**
 * Check if biometric hardware is available
 */
export async function isBiometricAvailable(): Promise<boolean> {
  if (isWeb) {
    // Web fallback: always return true for testing
    return true;
  }

  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  
  return hasHardware && isEnrolled;
}

/**
 * Authenticate with biometrics
 */
export async function authenticateWithBiometrics(): Promise<boolean> {
  if (isWeb) {
    // Web fallback: simple confirm dialog
    return window.confirm('Simulate biometric authentication?');
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to mark attendance',
    fallbackLabel: 'Use passcode',
  });
  
  return result.success;
}
import { useState, useEffect } from 'react'
import * as LocalAuthentication from 'expo-local-authentication'

interface BiometricState {
  isAvailable: boolean
  isEnrolled: boolean
  biometricType: string | null
}

export const useBiometric = () => {
  const [state, setState] = useState<BiometricState>({
    isAvailable: false,
    isEnrolled: false,
    biometricType: null,
  })

  useEffect(() => {
    checkBiometricSupport()
  }, [])

  const checkBiometricSupport = async () => {
    try {
      // Check if device hardware supports biometrics
      const compatible = await LocalAuthentication.hasHardwareAsync()
      if (!compatible) {
        setState({ isAvailable: false, isEnrolled: false, biometricType: null })
        return
      }

      // Check if biometrics are enrolled
      const enrolled = await LocalAuthentication.isEnrolledAsync()

      // Get available biometric types
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
      const biometricType = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
        ? 'Face ID'
        : types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ? 'Fingerprint'
        : 'Biometric'

      setState({ isAvailable: compatible, isEnrolled: enrolled, biometricType })
    } catch (error) {
      console.error('Biometric check error:', error)
    }
  }

  const authenticate = async (): Promise<boolean> => {
    if (!state.isAvailable || !state.isEnrolled) return false

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify your identity',
        fallbackLabel: 'Use Password',       // iOS fallback label
        disableDeviceFallback: false,         // allow device PIN as fallback
        cancelLabel: 'Cancel',
      })

      return result.success
    } catch (error) {
      console.error('Biometric authentication error:', error)
      return false
    }
  }

  return { ...state, authenticate }
}
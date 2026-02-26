import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, Switch
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useBiometric } from '../../hooks/useBiometric'
import { saveTokens, saveUser, getToken } from '../../utils/secureStore'
import { useAuth } from '../../store/authStore'
import { studentLogin } from '../../services/authService'

const StudentLogin: React.FC = () => {
  const navigation = useNavigation<any>()
  const { login } = useAuth()
  const { isAvailable, isEnrolled, biometricType, authenticate } = useBiometric()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [rememberSession, setRememberSession] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please enter your email/matric number and password.')
      return
    }
    setLoading(true)
    try {
      const response = await studentLogin({ identifier, password, rememberSession })
      await saveTokens(response.token, response.refreshToken)
      await saveUser(response.student)
      login(response)
    } catch (err: any) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleBiometricLogin = async () => {
    setLoading(true)
    try {
      const success = await authenticate()
      if (success) {
        // Check if a token already exists (persisted session)
        const token = await getToken()
        if (token) {
          const savedUser = await import('../../utils/secureStore').then(m => m.getUser())
          if (savedUser) {
            login({ token, refreshToken: '', student: savedUser })
            return
          }
        }
        Alert.alert('Session Expired', 'Please log in with your password first to enable biometric login.')
      } else {
        Alert.alert('Authentication Failed', 'Biometric verification was not successful.')
      }
    } catch (err) {
      Alert.alert('Error', 'Biometric authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🎓</Text>
        </View>
        <Text style={styles.title}>Student Login</Text>
        <Text style={styles.subtitle}>BioAttend — Attendance made simple</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email or Matric Number</Text>
        <TextInput
          style={styles.input}
          placeholder="CSC/2021/001 or email@uni.edu"
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.row}>
          <Switch value={rememberSession} onValueChange={setRememberSession} trackColor={{ true: '#2563eb' }} />
          <Text style={styles.rememberText}>Remember this session</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>

        {/* Biometric Button — shown only if available and enrolled */}
        {isAvailable && isEnrolled && (
          <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin} disabled={loading}>
            <Text style={styles.biometricIcon}>
              {biometricType === 'Face ID' ? '🤳' : '👆'}
            </Text>
            <Text style={styles.biometricText}>Login with {biometricType}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.link}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#1e3a8a', padding: 40, alignItems: 'center', paddingTop: 80 },
  logo: { width: 70, height: 70, backgroundColor: '#3b82f6', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoText: { fontSize: 36 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#93c5fd', fontSize: 14 },
  form: { flex: 1, padding: 24, paddingTop: 32 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 16 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: '#1e293b',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  rememberText: { color: '#64748b', fontSize: 13 },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#2563eb',
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
  },
  biometricIcon: { fontSize: 22 },
  biometricText: { color: '#2563eb', fontWeight: '600', fontSize: 15 },
  link: { alignItems: 'center', marginTop: 20 },
  linkText: { color: '#2563eb', fontSize: 14 },
})

export default StudentLogin
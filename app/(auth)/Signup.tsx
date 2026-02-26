import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator, Switch
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigation } from '@react-navigation/native'
import { studentSignup } from '../../services/authService'

// --- Picker for level selection (simplified with TouchableOpacity) ---
const LEVELS = ['100', '200', '300', '400', '500']

const signupSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  matricNumber: z.string().min(5, 'Enter a valid matric number'),
  email: z.string().email('Enter a valid email'),
  department: z.string().min(2, 'Department is required'),
  level: z.enum(['100', '200', '300', '400', '500']),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
  agreedToTerms: z.boolean().refine((v) => v === true, 'You must accept the terms'),
}).refine((d) => d.password === d.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
})

type SignupForm = z.infer<typeof signupSchema>

const StudentSignup: React.FC = () => {
  const navigation = useNavigation<any>()
  const [loading, setLoading] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<string>('100')
  const [showLevelPicker, setShowLevelPicker] = useState(false)

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { level: '100', agreedToTerms: false },
  })

  const onSubmit = async (data: SignupForm) => {
    setLoading(true)
    try {
      await studentSignup(data)
      Alert.alert('Success', 'Account created! Please log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ])
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Signup failed.')
    } finally {
      setLoading(false)
    }
  }

  const FieldError = ({ msg }: { msg?: string }) =>
    msg ? <Text style={styles.errorText}>{msg}</Text> : null

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join BioAttend as a student</Text>

      {/* Full Name */}
      <Text style={styles.label}>Full Name *</Text>
      <Controller control={control} name="fullName" render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="Adaeze Nwosu" onChangeText={onChange} value={value} />
      )} />
      <FieldError msg={errors.fullName?.message} />

      {/* Matric Number */}
      <Text style={styles.label}>Matric Number *</Text>
      <Controller control={control} name="matricNumber" render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="CSC/2021/001" onChangeText={onChange} value={value} autoCapitalize="characters" />
      )} />
      <FieldError msg={errors.matricNumber?.message} />

      {/* Email */}
      <Text style={styles.label}>Email *</Text>
      <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="student@university.edu" onChangeText={onChange} value={value} keyboardType="email-address" autoCapitalize="none" />
      )} />
      <FieldError msg={errors.email?.message} />

      {/* Department */}
      <Text style={styles.label}>Department *</Text>
      <Controller control={control} name="department" render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="Computer Science" onChangeText={onChange} value={value} />
      )} />
      <FieldError msg={errors.department?.message} />

      {/* Level Picker */}
      <Text style={styles.label}>Level *</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowLevelPicker(!showLevelPicker)}>
        <Text style={{ color: '#1e293b' }}>{selectedLevel} Level</Text>
      </TouchableOpacity>
      {showLevelPicker && (
        <View style={styles.pickerDropdown}>
          {LEVELS.map((level) => (
            <TouchableOpacity
              key={level}
              style={styles.pickerItem}
              onPress={() => {
                setSelectedLevel(level)
                setValue('level', level as any)
                setShowLevelPicker(false)
              }}
            >
              <Text>{level} Level</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <FieldError msg={errors.level?.message} />

      {/* Phone (optional) */}
      <Text style={styles.label}>Phone Number (optional)</Text>
      <Controller control={control} name="phone" render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="+234 800 000 0000" onChangeText={onChange} value={value} keyboardType="phone-pad" />
      )} />

      {/* Password */}
      <Text style={styles.label}>Password *</Text>
      <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="Min. 8 chars" onChangeText={onChange} value={value} secureTextEntry />
      )} />
      <FieldError msg={errors.password?.message} />

      {/* Confirm Password */}
      <Text style={styles.label}>Confirm Password *</Text>
      <Controller control={control} name="confirmPassword" render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="Repeat password" onChangeText={onChange} value={value} secureTextEntry />
      )} />
      <FieldError msg={errors.confirmPassword?.message} />

      {/* Terms */}
      <Controller control={control} name="agreedToTerms" render={({ field: { onChange, value } }) => (
        <View style={styles.row}>
          <Switch value={value} onValueChange={onChange} trackColor={{ true: '#2563eb' }} />
          <Text style={styles.termsText}>I agree to the Terms of Service and Privacy Policy</Text>
        </View>
      )} />
      <FieldError msg={errors.agreedToTerms?.message} />

      {/* Submit */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#64748b', marginBottom: 28 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#1e293b',
  },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  termsText: { flex: 1, fontSize: 13, color: '#64748b' },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  linkContainer: { marginTop: 16, alignItems: 'center' },
  link: { color: '#2563eb', fontSize: 14, fontWeight: '500' },
  pickerDropdown: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, marginTop: 4 },
  pickerItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
})

export default StudentSignup
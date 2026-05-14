// student-app/src/screens/auth/Signup.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../types/navigation.types";

type SignupScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Signup"
>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

const DEPARTMENTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Engineering",
];
const LEVELS = [100, 200, 300, 400, 500];

export const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    matricNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: DEPARTMENTS[0],
    level: 200,
  });
  const [showPassword, setShowPassword] = useState(false);

  const { register, isLoading } = useAuthStore();

  const handleSignup = async () => {
    // Validation
    if (
      !formData.fullName ||
      !formData.matricNumber ||
      !formData.email ||
      !formData.password
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      await register({
        fullName: formData.fullName,
        matricNumber: formData.matricNumber,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        level: formData.level,
      });
      // After registration, user will be navigated to CourseRegistration
    } catch (err: any) {
      Alert.alert(
        "Signup Failed",
        err.response?.data?.message || "Registration failed",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register as a student</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={formData.fullName}
              onChangeText={(text) =>
                setFormData({ ...formData, fullName: text })
              }
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Matric Number</Text>
            <TextInput
              style={styles.input}
              placeholder="21/1234CS"
              value={formData.matricNumber}
              onChangeText={(text) =>
                setFormData({ ...formData, matricNumber: text })
              }
              autoCapitalize="characters"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="student@university.edu"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Department</Text>
            <View style={styles.pickerContainer}>
              {DEPARTMENTS.map((dept) => (
                <TouchableOpacity
                  key={dept}
                  style={[
                    styles.pickerOption,
                    formData.department === dept && styles.pickerOptionSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, department: dept })}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      formData.department === dept &&
                        styles.pickerOptionTextSelected,
                    ]}
                  >
                    {dept}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Level</Text>
            <View style={styles.levelContainer}>
              {LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.levelOption,
                    formData.level === level && styles.levelOptionSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, level })}
                >
                  <Text
                    style={[
                      styles.levelOptionText,
                      formData.level === level &&
                        styles.levelOptionTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="••••••••"
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Text>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.signupButton,
              isLoading && styles.signupButtonDisabled,
            ]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            disabled={isLoading}
          >
            <Text style={styles.loginLink}>
              Already have an account?{" "}
              <Text style={styles.loginLinkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  pickerOptionSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  pickerOptionText: {
    fontSize: 14,
    color: "#334155",
  },
  pickerOptionTextSelected: {
    color: "#fff",
  },
  levelContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  levelOption: {
    width: 60,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  levelOptionSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  levelOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  levelOptionTextSelected: {
    color: "#fff",
  },
  signupButton: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    textAlign: "center",
    marginTop: 20,
    color: "#64748b",
    fontSize: 14,
  },
  loginLinkBold: {
    color: "#2563eb",
    fontWeight: "600",
  },
});

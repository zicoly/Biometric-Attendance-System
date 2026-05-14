// student-app/src/screens/auth/CourseRegistration.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { studentService } from "../../services/studentService";
import { useAuthStore } from "../../store/authStore";
import { Course } from "../../types/student.types";

export const CourseRegistrationScreen: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { setEnrolled } = useAuthStore();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await studentService.getAvailableCourses();
      setCourses(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = (courseId: string) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId);
    } else {
      newSelected.add(courseId);
    }
    setSelectedCourses(newSelected);
  };

  const handleSubmit = async () => {
    if (selectedCourses.size === 0) {
      Alert.alert("Error", "Please select at least one course");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmEnrollment = async () => {
    setSubmitting(true);
    setShowConfirmModal(false);

    try {
      await studentService.submitEnrollment(Array.from(selectedCourses));
      setEnrolled(true);
      Alert.alert("Success", "Course registration completed!");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to register courses",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Course Registration</Text>
        <Text style={styles.subtitle}>
          Select the courses you want to enroll in for this semester
        </Text>
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️</Text>
          <Text style={styles.warningMessage}>
            This action is IRREVERSIBLE for the semester. Choose carefully!
          </Text>
        </View>
      </View>

      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.courseCard,
              selectedCourses.has(item._id) && styles.courseCardSelected,
            ]}
            onPress={() => toggleCourse(item._id)}
          >
            <View style={styles.courseInfo}>
              <Text style={styles.courseCode}>{item.courseCode}</Text>
              <Text style={styles.courseTitle}>{item.courseTitle}</Text>
              <Text style={styles.courseDetails}>
                {item.creditUnits} credits • Level {item.level} •{" "}
                {item.department}
              </Text>
              <Text style={styles.lecturer}>
                Lecturer: {item.lecturerId?.fullName || "TBA"}
              </Text>
            </View>
            <View style={styles.checkbox}>
              {selectedCourses.has(item._id) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <Text style={styles.selectedCount}>
          Selected: {selectedCourses.size} course
          {selectedCourses.size !== 1 ? "s" : ""}
        </Text>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (selectedCourses.size === 0 || submitting) &&
              styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={selectedCourses.size === 0 || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Confirm Enrollment</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⚠️ Confirm Enrollment</Text>
            <Text style={styles.modalMessage}>
              You are about to enroll in {selectedCourses.size} course(s). This
              action CANNOT be undone for the entire semester.
            </Text>
            <View style={styles.modalChecklist}>
              <Text style={styles.checklistItem}>
                ✓ I have read and understood the warning
              </Text>
              <Text style={styles.checklistItem}>
                ✓ I understand this is irreversible
              </Text>
              <Text style={styles.checklistItem}>
                ✓ I confirm my course selection
              </Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmEnrollment}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonConfirmText,
                  ]}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  warningText: {
    fontSize: 20,
  },
  warningMessage: {
    flex: 1,
    fontSize: 13,
    color: "#92400e",
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  courseCardSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  courseDetails: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  lecturer: {
    fontSize: 12,
    color: "#64748b",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  checkmark: {
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "bold",
  },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCount: {
    fontSize: 14,
    color: "#64748b",
  },
  submitButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dc2626",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 16,
    textAlign: "center",
  },
  modalChecklist: {
    marginBottom: 20,
    gap: 8,
  },
  checklistItem: {
    fontSize: 13,
    color: "#166534",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: "#f1f5f9",
  },
  modalButtonConfirm: {
    backgroundColor: "#dc2626",
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  modalButtonConfirmText: {
    color: "#fff",
  },
});

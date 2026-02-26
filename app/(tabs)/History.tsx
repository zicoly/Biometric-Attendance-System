// app/(tabs)/History.tsx

import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

// Placeholder — replace with real attendance history data
const History: React.FC = () => {
  const mockHistory = [
    {
      id: "1",
      date: "Mon, 24 Feb 2026",
      course: "CSC 401",
      status: "Present",
      time: "08:15 AM",
    },
    {
      id: "2",
      date: "Tue, 25 Feb 2026",
      course: "CSC 405",
      status: "Present",
      time: "10:00 AM",
    },
    {
      id: "3",
      date: "Wed, 26 Feb 2026",
      course: "CSC 401",
      status: "Absent",
      time: "--",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance History</Text>
      <FlatList
        data={mockHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.course}>{item.course}</Text>
              <Text style={styles.date}>
                {item.date} · {item.time}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                item.status === "Present" ? styles.present : styles.absent,
              ]}
            >
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    padding: 20,
    paddingBottom: 8,
    paddingTop: 60,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardLeft: { flex: 1 },
  course: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  date: { fontSize: 12, color: "#94a3b8", marginTop: 4 },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  present: { backgroundColor: "#dcfce7" },
  absent: { backgroundColor: "#fee2e2" },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#374151" },
});

export default History;

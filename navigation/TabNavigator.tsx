// student-app/src/navigation/TabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "../types/navigation.types";
import { ClassesScreen } from "../app/(tabs)/ClassesScreen";
import { DashboardScreen } from "../app/(tabs)/DashboardScreen";
import { HistoryScreen } from "../app/(tabs)/HistoryScreen";
import { ProfileScreen } from "../app/(tabs)/ProfileScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

const getTabIcon = (routeName: string, focused: boolean) => {
  const icons: Record<string, { focused: string; unfocused: string }> = {
    Dashboard: { focused: "🏠", unfocused: "🏠" },
    Classes: { focused: "📚", unfocused: "📚" },
    History: { focused: "📋", unfocused: "📋" },
    Profile: { focused: "👤", unfocused: "👤" },
  };

  const icon = icons[routeName];
  return icon ? (focused ? icon.focused : icon.unfocused) : "📱";
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const icon = getTabIcon(route.name, focused);
          return <>{icon}</>;
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e2e8f0",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: "#2563eb",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Classes"
        component={ClassesScreen}
        options={{ title: "My Classes" }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "Attendance History" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
};

// App.tsx

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Auth store — provides isAuthenticated and isLoading
import { AuthProvider, useAuth } from "./store/authStore";

// Navigators
import AuthNavigator from "./navigation/AuthNavigator";
import TabNavigator from "./navigation/TabNavigator";

import { RootStackParamList } from "./types/navigation.types";

const RootStack = createNativeStackNavigator<RootStackParamList>();

/**
 * RootNavigator:
 * Decides which navigator to show based on auth state.
 * - Not authenticated → AuthNavigator (Login / Signup)
 * - Authenticated     → TabNavigator  (Dashboard / History / Profile)
 */
const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // While checking SecureStore for a saved token, show a splash/loader
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // Logged in — show the main tab app
        <RootStack.Screen name="Main" component={TabNavigator} />
      ) : (
        // Logged out — show login/signup
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

/**
 * App — root component.
 * Order matters:
 * SafeAreaProvider → NavigationContainer → AuthProvider → RootNavigator
 */
const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
});

export default App;

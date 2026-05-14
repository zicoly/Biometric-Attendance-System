// student-app/src/navigation/AuthNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/navigation.types";
import { LoginScreen } from "../app/(auth)/Login";
import { SignupScreen } from "../app/(auth)/Signup";
import { CourseRegistrationScreen } from "../app/(auth)/courseRegistration";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#f5f5f5" },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen
        name="CourseRegistration"
        component={CourseRegistrationScreen}
      />
    </Stack.Navigator>
  );
};

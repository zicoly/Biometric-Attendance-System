// student-app/src/types/navigation.types.ts
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  CourseRegistration: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Classes: undefined;
  History: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

// types/navigation.types.ts

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  History: undefined;
  Profile: undefined;
};

// Root navigator decides between Auth flow and Main (tab) flow
export type RootStackParamList = {
  Auth: undefined; // goes to AuthStack
  Main: undefined; // goes to TabNavigator
};

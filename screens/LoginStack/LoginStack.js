import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import CA from "./CA";
import Car from "./Car";
import FP from "./FP";
import FPModal from "./FPModal";
import Login from "./Login";

const Stack = createNativeStackNavigator();

export default function LoginStack() {
  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Create Account" component={CA} />
        <Stack.Screen name="Car" component={Car} />
        <Stack.Screen name="Forgot Password" component={FP} />
        <Stack.Screen
          name="Forgot Password Modal"
          component={FPModal}
          options={{ presentation: "transparentModal" }}
        />
      </Stack.Navigator>
    </>
  );
}

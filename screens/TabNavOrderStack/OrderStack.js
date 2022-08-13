import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import Schedule from "./Schedule";
import CarSelect from "./CarSelect";
import Confirm from "./Confirm";
const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Schedule" component={Schedule} />
        <Stack.Screen name="Car Select" component={CarSelect} />
        <Stack.Screen name="Confirm" component={Confirm} />
      </Stack.Navigator>
    </>
  );
}

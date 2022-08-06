import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import BillingInformation from "./BillingInformation";
import CarInformation from "./CarInformation";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Billing Information"
          component={BillingInformation}
        />
        <Stack.Screen name="Car Information" component={CarInformation} />
      </Stack.Navigator>
    </>
  );
}

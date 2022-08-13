import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";
import ChangeName from "./ChangeName";
import EditCars from "./EditCars";
import EditCar from "./EditCar";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={Profile} />
        <Stack.Screen name="Change Password" component={ChangePassword} />
        <Stack.Screen name="Delete Account" component={DeleteAccount} />
        <Stack.Screen name="Change Name" component={ChangeName} />
        <Stack.Screen name="Edit Cars" component={EditCars} />
        <Stack.Screen name="Edit Car" component={EditCar} />
      </Stack.Navigator>
    </>
  );
}

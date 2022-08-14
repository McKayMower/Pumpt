import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";

import Map from "./Map";
import SelectDate from "./SelectDate";
import ConfirmOrder from "./ConfirmOrder";
import AddCar from "./AddCar";
const Stack = createNativeStackNavigator();

export default function FunnelStack({ route }) {
  const { cars } = route.params;
  // console.log("cars in funnel stack: ", cars);
  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Map"
          component={Map}
          initialParams={{ cars: cars }}
        />
        <Stack.Screen name="Schedule" component={SelectDate} />
        <Stack.Screen name="Confirm" component={ConfirmOrder} />
        <Stack.Screen name="Add Car" component={AddCar} />
      </Stack.Navigator>
    </>
  );
}

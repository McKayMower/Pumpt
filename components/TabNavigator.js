import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Feather } from "react-native-vector-icons";
import { StyleSheet } from "react-native";
import { border, colors } from "../styles";
import Map from "../screens/Map";
import ProfileStack from "../screens/TabNavProfileStack/ProfileStack";
import OrderStack from "../screens/TabNavOrderStack/OrderStack";

const TabNav = createMaterialBottomTabNavigator();
export default function TabNavigator() {
  return (
    <TabNav.Navigator
      activeColor={colors.logoColor}
      labeled={false}
      barStyle={styles.navbar}
    >
      <TabNav.Screen
        name="Map"
        component={Map}
        options={{
          tabBarLabel: "Map",
          tabBarIcon: ({ color }) => (
            <Feather name="map" color={color} size={30} style={styles.icon} />
          ),
        }}
      />
      <TabNav.Screen
        name="Order"
        component={OrderStack}
        options={{
          tabBarLabel: "Order",
          tabBarIcon: ({ color }) => (
            <Feather
              name="calendar"
              color={color}
              size={30}
              style={styles.icon}
            />
          ),
        }}
      />
      <TabNav.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Feather name="user" color={color} size={30} style={styles.icon} />
          ),
        }}
      />
    </TabNav.Navigator>
  );
}

const styles = StyleSheet.create({
  navbar: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.navbar.backgroundColor,
    overflow: "hidden",
    position: "absolute",
    // paddingTop: "5%",
    paddingHorizontal: "1%",
    borderTopRightRadius: border.borderRadius,
    borderTopLeftRadius: border.borderRadius,
  },
  navbarText: {
    fontSize: 40,
  },
  icon: {
    height: 30,
    width: 30,
  },
  tabBarLabelText: {
    fontSize: 15,
    textAlign: "center",
  },
});

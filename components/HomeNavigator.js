import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Feather } from "react-native-vector-icons";
import { StyleSheet } from "react-native";
import { border, colors } from "../styles";
import ProfileStack from "../screens/TabNavProfileStack/ProfileStack";
import Home from "../screens/Home";
const TabNav = createMaterialBottomTabNavigator();

export default function HomeNavigator() {
  return (
    <TabNav.Navigator
      activeColor={colors.logoColor}
      labeled={false}
      barStyle={styles.navbar}
    >
      <TabNav.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" color={color} size={30} style={styles.icon} />
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

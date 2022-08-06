import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Feather } from "react-native-vector-icons";
import { StyleSheet, Text } from "react-native";
import { border, colors } from "../styles";
import Map from "../screens/Map";
import ProfileStack from "../screens/TabNavProfileStack/ProfileStack";
import OrderStack from "../screens/TabNavOrderStack/OrderStack";
import * as Haptics from "expo-haptics";

const TabNav = createMaterialBottomTabNavigator();
export default function TabNavigator() {
  return (
    <TabNav.Navigator
      labeled={false}
      activeColor="white" //Custom color for icon and label in the active tab.
      inactiveColor="#858585" //Custom color for icon and label in the inactive tab.
      barStyle={styles.navbar}
      screenOptions={({ route }) => ({
        tabBarLabel: <Text style={styles.tabBarLabelText}>{route.name}</Text>,
        tabBarIcon: (tabInfo) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          let iconName;

          if (route.name === "Map") {
            iconName = "map";
          } else if (route.name === "Order") {
            iconName = "dollar-sign";
          } else if (route.name === "Profile") {
            iconName = "user";
          }

          return <Feather name={iconName} size={30} style={styles.icon} />;
        },
      })}
    >
      <TabNav.Screen name="Map" component={Map} />
      <TabNav.Screen name="Order" component={OrderStack} />
      <TabNav.Screen name="Profile" component={ProfileStack} />
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
    paddingTop: "5%",
    paddingHorizontal: "1%",
    borderTopRightRadius: border.borderRadius,
    borderTopLeftRadius: border.borderRadius,
    borderColor: "rgba(167, 167, 167, 1)",
  },
  navbarText: {
    fontSize: 40,
  },
  icon: {
    color: colors.navbar.iconColor,
    height: 30,
    width: 30,
  },
  tabBarLabelText: {
    fontSize: 15,
    textAlign: "center",
  },
});

import { StyleSheet } from "react-native";
import colors from "./colors";
import border from "./border";
import text from "./text";

export default button = StyleSheet.create({
  container: {
    width: "80%",
    padding: "5%",
    marginVertical: "2.5%",
    alignItems: "center",
  },
  container_primary: {
    backgroundColor: colors.button.backgroundColorPrimary,
    borderRadius: border.borderRadius,
  },
  container_secondary: {
    borderColor: colors.logoColor,
    borderWidth: border.borderWidth,
    borderRadius: border.borderRadius,
  },
  container_tertiary: {
    marginVertical: 0,
  },
  text: {
    // fontFamily: text.appText,
    fontSize: 15,
    fontWeight: "bold",
    color: colors.button.textPrimary,
  },
  text_secondary: {
    color: colors.button.textSecondary,
  },
  text_tertiary: {
    fontWeight: "bold",
    color: colors.button.textTertiary,
  },
  text_quaternary: {
    color: colors.quaternaryText,
    fontSize: 14,
  },
});

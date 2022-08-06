import { StyleSheet } from "react-native";
import colors from "./colors";
import border from "./border";
import text from "./text";

export default textInput = StyleSheet.create({
  blurColor: colors.textInput.blurColor,
  focusColor: colors.textInput.focusColor,
  placeholderTextColor: colors.textInput.placeholderTextColor,
  container: {
    flexDirection: "row",
    width: "80%",
    backgroundColor: colors.textInput.backgroundColor,
    marginVertical: "2.5%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: border.borderWidth,
    borderRadius: border.borderRadius,
  },
  style: {
    flex: 1,
    padding: "5%",
    fontSize: 18,
    color: colors.textInput.textColor,
    // fontFamily: text.appText,
  },
  iconStyle: {
    marginLeft: "7.5%",
  },
  iconSize: 20,
  iconColor: colors.textInput.iconColor,
});

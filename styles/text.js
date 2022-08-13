import { StyleSheet } from "react-native";
import colors from "./colors";

let headerFontSize = 25;
let tertiaryFontWeight = "bold";

export default text = StyleSheet.create({
  appText: "FjallaOne_400Regular",
  screenHeader: {
    fontSize: headerFontSize,
    fontWeight: tertiaryFontWeight,
    marginVertical: "10%",
    color: colors.screenHeader.color,
    alignSelf: "center",
  },
  profileText: {
    fontSize: 20,
    // fontFamily: "FjallaOne_400Regular",
    color: colors.screenHeader.color,
  },
});

import { StyleSheet, View, Text } from "react-native";
import CustomButton from "./CustomButton";
import { border, colors } from "../styles";

export default function InformationModal(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.titleText}</Text>
      <Text style={styles.paragraph}>{props.infoText}</Text>
      <CustomButton text="OK" type="primary" onPress={props.onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "auto",
    width: "80%",
    backgroundColor: colors.quaternaryText,
    margin: "2.5%",
    borderRadius: border.borderRadius,
    padding: "5%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: "2.5%",
  },
  paragraph: {
    fontSize: 15,
    marginVertical: "5%",
  },
});

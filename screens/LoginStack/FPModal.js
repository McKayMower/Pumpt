import { StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";

export default function FPModal() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password Link Sent</Text>
        <Text style={styles.paragraph}>
          Please check your email for the forgot password link.
        </Text>
        <CustomButton
          text="OK"
          type="primary"
          backgroundColor="white"
          color="black"
          onPress={() => {
            navigation.navigate("Forgot Password");
            navigation.navigate("Login");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "25%",
    width: "80%",
    backgroundColor: "rgba(130, 130, 130, 1)",
    margin: "2.5%",
    borderRadius: 5,
  },
  title: {
    fontSize: 23,
    marginVertical: "2.5%",
    width: "80%",
  },
  paragraph: { marginBottom: "5%", width: "80%" },
});

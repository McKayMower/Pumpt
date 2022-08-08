import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import InformationModal from "../../components/InformationModal";

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
      <InformationModal
        titleText="Forgot Password Link Sent!"
        infoText="Please check your email for the forgot password link."
        onPress={() => {
          navigation.goBack();
          navigation.navigate("Login");
        }}
      />
    </View>
  );
}

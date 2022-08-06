import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView, Text, StyleSheet, Alert } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import AnimatedInput from "../../components/AnimatedInput";
import CustomButton from "../../components/CustomButton";
import Background from "../../components/Background";
import { text } from "../../styles";
export default function BillingInformation() {
  const [fullname, setFullname] = useState();
  const [email, setEmail] = useState();
  const [homeAddress, setHomeAdress] = useState();
  const navigation = useNavigation();
  const auth = getAuth();
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = () => {
    auth.currentUser.displayName && setFullname(auth.currentUser.displayName);
    auth.currentUser.email && setEmail(auth.currentUser.email);
  };
  const verifyCarPressed = () => {
    navigation.navigate("Car Information");
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Background>
        <SafeAreaView style={styles.container}>
          <Text style={text.screenHeader}>Setup Billing Information!</Text>
          <AnimatedInput
            placeholder="Full Name"
            value={fullname}
            setValue={setFullname}
          />

          <AnimatedInput
            placeholder={"Email"}
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
          />

          <AnimatedInput
            placeholder={"Billing Address"}
            value={homeAddress}
            setValue={setHomeAdress}
            textContentType="fullStreetAddress"
          />
          <CustomButton
            type="primary"
            text="Verify Car Information"
            onPress={verifyCarPressed}
          />
        </SafeAreaView>
      </Background>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#051c60",
    marginVertical: "10%",
  },
});

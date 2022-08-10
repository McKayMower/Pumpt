import React from "react";
import { useState } from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import Background from "../../components/Background";
import AnimatedInput from "../../components/AnimatedInput";
import CustomButton from "../../components/CustomButton";
import ReportError from "../../functions/ReportError";
import { text } from "../../styles";

export default function FP() {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const auth = getAuth();

  const onSendPressed = () => {
    // sendPasswordResetEmail(auth, email)
      // .then(() => {
        navigation.navigate("Forgot Password Modal");
      // })
      // .catch((error) => {
      //   ReportError(error, email);
      // });
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
          <Text style={text.screenHeader}>Reset Your Password</Text>
          <AnimatedInput
            placeholder="Email"
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
          />
          <CustomButton text="Send" onPress={onSendPressed} type="primary" />
          <CustomButton
            text="Back To Sign In"
            onPress={navigation.goBack}
            type="secondary"
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
    color: "black",
    marginVertical: "10%",
  },
});

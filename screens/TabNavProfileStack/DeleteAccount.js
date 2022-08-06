import React, { useState } from "react";
import { Alert, SafeAreaView, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import {
  getAuth,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import AnimatedInput from "../../components/AnimatedInput";
import CustomButton from "../../components/CustomButton";
import ReportError from "../../functions/ReportError";
import Background from "../../components/Background";
import { text } from "../../styles";

const AsyncAlert = async () =>
  new Promise((resolve) => {
    Alert.alert(
      "We Are Sad To See You Go",
      "Your account with us has been deleted.",
      [
        {
          text: "Ok",
          onPress: () => {
            resolve("YES");
          },
        },
      ],
      { cancelable: false }
    );
  });

export default function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const auth = getAuth();
  const navigation = useNavigation();

  const onDeleteMyAccountPressed = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }
    const credential = EmailAuthProvider.credential(email, password);
    reauthenticateWithCredential(auth.currentUser, credential)
      .then(async (res) => {
        deleteUser(auth.currentUser)
          .then(async () => {
            await AsyncAlert();
          })
          .catch((error) => {
            ReportError(error);
          });
      })
      .catch((error) => {
        ReportError(error);
        return;
      });
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
          <Text style={text.screenHeader}>Delete Your Account</Text>

          <AnimatedInput
            placeholder="Email"
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
          />
          <AnimatedInput
            placeholder="Password"
            value={password}
            setValue={setPassword}
            secureTextEntry={true}
          />
          <AnimatedInput
            placeholder="Confirm Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            secureTextEntry={true}
          />
          <CustomButton
            text="Delete My Account"
            onPress={onDeleteMyAccountPressed}
            type="primary"
            // backgroundColor="rgba(245, 39, 76, 0.8)"
          />
          <CustomButton
            text="Go Back"
            onPress={() => {
              navigation.navigate("Main");
            }}
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
    color: "#051c60",
    marginVertical: "10%",
  },
  currentEmail: {
    marginBottom: "5%",
  },
});

import React, { useState, useRef } from "react";
import { Alert, SafeAreaView, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import AnimatedInput from "../../components/AnimatedInput";
import CustomButton from "../../components/CustomButton";
import ReportError from "../../functions/ReportError";
import Background from "../../components/Background";
import { text } from "../../styles";

const AsyncAlert = async () =>
  new Promise((resolve) => {
    Alert.alert(
      "Update Successful",
      "Your Email Has Been Updated.",
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

export default function ChangeEmail() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const auth = getAuth();
  const navigation = useNavigation();
  const passwordRef = useRef();
  const newPasswordRef = useRef();
  const repeatNewPasswordRef = useRef();
  const onUpdatePasswordPressed = () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("New passwords do not match");
      return;
    }

    const credential = EmailAuthProvider.credential(email, currentPassword);
    reauthenticateWithCredential(auth.currentUser, credential)
      .then(async () => {
        updatePassword(auth.currentUser, newPassword)
          .then(async () => {
            await AsyncAlert();
            navigation.navigate("Main");
          })
          .catch((error) => {
            ReportError(error);
          });
      })
      .catch((error) => {
        ReportError(error);
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
          <Text style={text.screenHeader}>Update Your Password</Text>

          <AnimatedInput
            placeholder="Email"
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
          />
          <AnimatedInput
            ref={passwordRef}
            placeholder="Password"
            value={currentPassword}
            setValue={setCurrentPassword}
            secureTextEntry={true}
            onSubmitEditing={() => newPasswordRef.current?.focus()}
            blurOnSubmit={false}
          />
          <AnimatedInput
            ref={newPasswordRef}
            placeholder="New Password"
            value={newPassword}
            setValue={setNewPassword}
            secureTextEntry={true}
            onSubmitEditing={() => repeatNewPasswordRef.current?.focus()}
            blurOnSubmit={false}
          />
          <AnimatedInput
            ref={repeatNewPasswordRef}
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            setValue={setConfirmNewPassword}
            secureTextEntry={true}
          />
          <CustomButton
            text="Update Password"
            onPress={onUpdatePasswordPressed}
            type="primary"
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
});

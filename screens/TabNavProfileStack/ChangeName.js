import React, { useState, useRef } from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updateProfile,
} from "firebase/auth";

import AnimatedInput from "../../components/AnimatedInput";
import CustomButton from "../../components/CustomButton";
import ReportError from "../../functions/ReportError";
import Background from "../../components/Background";
import { text } from "../../styles";

export default function ChangeName() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState();
  const [newLastName, setNewLastName] = useState();
  const [password, setPassword] = useState("");

  const auth = getAuth();
  const navigation = useNavigation();
  const passwordRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();

  const onUpdateNamePressed = () => {
    const credential = EmailAuthProvider.credential(currentEmail, password);
    reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: `${newFirstName} ${newLastName}`,
        })
          .then(() => {
            console.log("profile has been updated");
            navigation.goBack();
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
          <Text style={text.screenHeader}>Update Your Name</Text>
          <AnimatedInput
            placeholder="Email"
            value={currentEmail}
            setValue={setCurrentEmail}
            keyboardType="email-address"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
          />
          <AnimatedInput
            ref={passwordRef}
            placeholder="Password"
            value={password}
            setValue={setPassword}
            secureTextEntry={true}
            onSubmitEditing={() => firstNameRef.current?.focus()}
            blurOnSubmit={false}
          />
          <AnimatedInput
            ref={firstNameRef}
            placeholder="New First Name"
            value={newFirstName}
            setValue={setNewFirstName}
            onSubmitEditing={() => lastNameRef.current?.focus()}
            blurOnSubmit={false}
          />
          <AnimatedInput
            ref={lastNameRef}
            placeholder="New Last Name"
            value={newLastName}
            setValue={setNewLastName}
          />
          <CustomButton
            text="Update Name"
            onPress={onUpdateNamePressed}
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
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#051c60",
    marginVertical: "10%",
  },
  currentName: {
    marginBottom: "5%",
  },
});

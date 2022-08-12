import React, { useState, useRef } from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  reload,
  updateProfile,
} from "firebase/auth";
import { text } from "../../styles";

import AnimatedInput from "../../components/AnimatedInput";
import CustomButton from "../../components/CustomButton";
import ReportError from "../../functions/ReportError";
import Background from "../../components/Background";
import { getFirestore, updateDoc, doc } from "firebase/firestore";

export default function ChangeName() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newName, setNewName] = useState();
  const [password, setPassword] = useState("");

  const auth = getAuth();
  const navigation = useNavigation();
  const passwordRef = useRef();
  const nameRef = useRef();

  const onUpdateNamePressed = () => {
    const credential = EmailAuthProvider.credential(currentEmail, password);
    reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: `${newName}`,
        })
          .then(async () => {
            const db = getFirestore();
            const userDoc = doc(db, "Users", auth.currentUser.email);
            await updateDoc(userDoc, { name: newName })
              .then(() => {
                reload(auth.currentUser);
                console.log("name updated");
              })
              .catch((error) => ReportError(error));
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
            onSubmitEditing={() => nameRef.current?.focus()}
            blurOnSubmit={false}
          />
          <AnimatedInput
            ref={nameRef}
            placeholder="New Name"
            value={newName}
            setValue={setNewName}
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

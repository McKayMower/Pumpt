import { React, useState, useRef } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  deleteUser,
  updateProfile,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { text, button } from "../../styles";
import * as Haptics from "expo-haptics";
import Background from "../../components/Background";
import AnimatedInput from "../../components/AnimatedInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SocialSigninButtons from "../../components/SocialSigninButtons";
import ReportError from "../../functions/ReportError";
import CustomButton from "../../components/CustomButton";

export default function CA() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const navigation = useNavigation();
  const emailRef = useRef();
  const phoneNumberRef = useRef();
  const passwordRef = useRef();
  const repeatPasswordRef = useRef();
  const auth = getAuth();

  const onRegisterPressed = async () => {
    //check if passwords match
    if (password !== passwordRepeat) {
      Alert.alert("Please make sure passwords match");
      return;
    }
    if (!name) {
      Alert.alert("Please enter your full name");
      return;
    }
    if (!phoneNumber) {
      Alert.alert("Please enter a phone number");
      return;
    }
    if (!password || !passwordRepeat) {
      Alert.alert("Please fill in the password fields");
      return;
    }

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        updateProfile(auth.currentUser, {
          displayName: `${name}`,
        })
          .then(async () => {
            const db = getFirestore();
            const userDoc = doc(db, "Users", auth.currentUser.email);
            const docData = {
              name: auth.currentUser.displayName,
              email: auth.currentUser.email,
              phoneNumber: phoneNumber,
              cars: {},
            };
            await setDoc(userDoc, docData)
              .then(() => {})
              .catch((error) => ReportError(error));

            await sendEmailVerification(auth.currentUser)
              .then(async () => {
                navigation.navigate("Car");
              })
              .catch((error) => {
                auth.currentUser && deleteUser(auth.currentUser);
                ReportError(error);
              });
            await AsyncStorage.setItem("email", email);
            await AsyncStorage.setItem("password", password);
          })
          .catch((error) => {
            ReportError(error);
          });
      })
      .catch((error) => {
        ReportError(error, email);
        setEmail("");
        return;
      });
  };

  const onTermsOfUsePressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    console.log("terms of use pressed");
  };
  const onPrivacyPolicyPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    console.log("privacy policy pressed");
  };
  const onSignInPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate("Login");
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
          <Text style={text.screenHeader}>Welcome to Pumpt!</Text>
          <AnimatedInput
            placeholder="Full Name"
            textContentType={"name"}
            value={name}
            setValue={setName}
            onSubmitEditing={() => emailRef.current?.focus()}
            blurOnSubmit={false}
          />
          <AnimatedInput
            ref={emailRef}
            placeholder="Email"
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
            onSubmitEditing={() => phoneNumberRef.current?.focus()}
            blurOnSubmit={false}
            textContentType={"emailAddress"}
          />
          <AnimatedInput
            ref={phoneNumberRef}
            placeholder="Phone Number"
            value={phoneNumber}
            setValue={setPhoneNumber}
            keyboardType="phone-pad"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
            maxLength={12}
            textContentType={"telephoneNumber"}
          />
          <AnimatedInput
            ref={passwordRef}
            placeholder="Password"
            value={password}
            setValue={setPassword}
            secureTextEntry={true}
            onSubmitEditing={() => repeatPasswordRef.current?.focus()}
            blurOnSubmit={false}
            textContentType={"newPassword"}
          />
          <AnimatedInput
            ref={repeatPasswordRef}
            placeholder="Repeat Password"
            value={passwordRepeat}
            setValue={setPasswordRepeat}
            secureTextEntry={true}
            autoCorrect={false}
          />
          <CustomButton
            text="Register"
            onPress={onRegisterPressed}
            type="primary"
          />

          <Text style={[button.text_quaternary, styles.agreement]}>
            By registering, you confirm that you have read and accept our{" "}
            <Text style={button.text_tertiary} onPress={onTermsOfUsePressed}>
              Terms of Use
            </Text>{" "}
            and{" "}
            <Text style={button.text_tertiary} onPress={onPrivacyPolicyPressed}>
              Privacy Policy
            </Text>
          </Text>

          <View style={styles.newHereSignInContainer}>
            <Text style={button.text_quaternary}>Already have an account?</Text>
            <TouchableOpacity
              style={styles.signInContainer}
              onPress={onSignInPressed}
            >
              <Text style={button.text_tertiary}>Sign In!</Text>
            </TouchableOpacity>
          </View>
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
  agreement: {
    justifyContent: "center",
    alignItems: "center",
    width: "75%",
    marginVertical: "2.5%",
  },
  newHereSignInContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "2.5%",
  },
  signInContainer: {
    marginHorizontal: "1%",
  },
});

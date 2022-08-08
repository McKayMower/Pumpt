import React, { useState, useEffect } from "react";
import {
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  SafeAreaView,
  Image,
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import Background from "../../components/Background";
import ReportError from "../../functions/ReportError";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SocialSigninButtons from "../../components/SocialSigninButtons";
import CustomButton from "../../components/CustomButton";
import AnimatedInput from "../../components/AnimatedInput";
import { button } from "../../styles";

export default function Login() {
  const auth = getAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getData = async () => {
    // console.log("getting data...");
    try {
      const storedEmail = await AsyncStorage.getItem("email");
      const storedPassword = await AsyncStorage.getItem("password");

      if (storedEmail !== null && storedPassword !== null) {
        // console.log("stored email and password found");
        setEmail(storedEmail);
        setPassword(storedPassword);
      }
    } catch (error) {
      ReportError(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const submitData = async () => {
    try {
      // console.log("setting data...");
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("password", password);
    } catch (error) {
      ReportError(error);
    }
  };

  const onSignInPressed = () => {
    if (!email) {
      Alert.alert("Please enter an email");
      return;
    }
    if (!password) {
      Alert.alert("Please enter a password");
      return;
    }
    submitData().then(async () => {
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredentials) => {
          if (!auth.currentUser?.emailVerified) {
            Alert.alert(
              "A verification email has been sent to your email, please verify your email to log in."
            );
            sendEmailVerification(auth.currentUser);
            //async storage username here
          }
        })
        .catch((error) => {
          ReportError(error, email);
        });
    });
  };
  const onSignUpPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate("Create Account");
  };
  const onForgotPasswordPressed = () => {
    navigation.navigate("Forgot Password");
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <StatusBar />
      <Background>
        <SafeAreaView style={styles.container}>
          <View style={styles.logoView}>
            <Image
              style={styles.logo}
              source={require("../../assets/logo.png")}
            />
          </View>
          <AnimatedInput
            placeholder="Username"
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
          <CustomButton
            text="Log In"
            type="primary"
            onPress={onSignInPressed}
          />
          <CustomButton
            text="Forgot Password?"
            type="tertiary"
            onPress={onForgotPasswordPressed}
          />
          <View style={styles.noAccountSignUpContainer}>
            <Text style={button.text_quaternary}>Don't have an account?</Text>
            <TouchableOpacity
              style={styles.signUpContainer}
              onPress={onSignUpPressed}
            >
              <Text style={button.text_tertiary}>Sign Up!</Text>
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
  logo: {
    resizeMode: "contain",
    height: "75%",
    // DO NOT MESS WITH WIDTH, SINCE IT IS SMALLER THAN HEIGHT
  },
  logoView: {
    alignItems: "center",
    justifyContent: "center",
    height: "40%",
  },
  noAccountSignUpContainer: {
    marginVertical: "30%",
    width: "80%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "2.5%",
  },
  signUpContainer: {
    marginHorizontal: "1%",
  },
});

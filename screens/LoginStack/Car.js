import React, { useState, useRef } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView, Alert, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import AnimatedInput from "../../components/AnimatedInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReportError from "../../functions/ReportError";
import Background from "../../components/Background";
import { text } from "../../styles";
const AsyncAlert = async () =>
  new Promise((resolve) => {
    Alert.alert(
      "You have successfully added a car!",
      "Please check your inbox for a verification email to log in!",
      [
        {
          text: "ok",
          onPress: () => {
            resolve("YES");
          },
        },
      ],
      { cancelable: false }
    );
  });

export default function CreateCar() {
  const navigation = useNavigation();
  const [make, setMake] = useState();
  const [model, setModel] = useState();
  const [year, setYear] = useState();
  const [color, setColor] = useState();
  const [LPN, setLPN] = useState();
  const [fuelType, setFuelType] = useState();
  const modelRef = useRef();
  const yearRef = useRef();
  const colorRef = useRef();
  const LPRef = useRef();
  const fuelTypeRef = useRef();

  const addCar = async () => {
    if (!make || !model || !year || !color || !LPN || !fuelType) {
      Alert.alert("Please make sure every field is completed.");
      return;
    }
    if (
      fuelType.toLowerCase() === "unleaded" ||
      fuelType.toLowerCase() === "premium" ||
      fuelType.toLowerCase() === "diesel"
    ) {
    } else {
      Alert.alert(
        "Please type 'unleaded', 'premium', or 'diesel' for the fuel type"
      );
      return;
    }
    try {
      await AsyncStorage.setItem("make", make);
      await AsyncStorage.setItem("model", model);
      await AsyncStorage.setItem("year", year);
      await AsyncStorage.setItem("color", color);
      await AsyncStorage.setItem("LPN", LPN);
      await AsyncStorage.setItem("fuelType", fuelType);
    } catch (error) {
      ReportError(error);
    }
    await AsyncAlert();
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
          <Text style={text.screenHeader}>Create a Car!</Text>
          <AnimatedInput
            placeholder="Make"
            value={make}
            setValue={setMake}
            blurOnSubmit={false}
            onSubmitEditing={() => modelRef.current?.focus()}
          />
          <AnimatedInput
            ref={modelRef}
            placeholder="Model"
            value={model}
            setValue={setModel}
            blurOnSubmit={false}
            onSubmitEditing={() => yearRef.current?.focus()}
          />
          <AnimatedInput
            ref={yearRef}
            placeholder="Year"
            value={year}
            setValue={setYear}
            maxLength={4}
            keyboardType="number-pad"
            blurOnSubmit={false}
            onSubmitEditing={() => colorRef.current?.focus()}
          />
          <AnimatedInput
            placeholder="Color"
            ref={colorRef}
            value={color}
            setValue={setColor}
            blurOnSubmit={false}
            onSubmitEditing={() => LPRef.current?.focus()}
          />
          <AnimatedInput
            ref={LPRef}
            placeholder="License Plate"
            value={LPN}
            setValue={setLPN}
            maxLength={8}
            blurOnSubmit={false}
            onSubmitEditing={() => fuelTypeRef.current?.focus()}
          />
          <AnimatedInput
            ref={fuelTypeRef}
            placeholder="Fuel Type"
            value={fuelType}
            setValue={setFuelType}
          />
          <CustomButton type="primary" text={`Add Car`} onPress={addCar} />
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

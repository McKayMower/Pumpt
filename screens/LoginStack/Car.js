import React, { useState, useRef } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView, Alert, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { text } from "../../styles";
import CustomButton from "../../components/CustomButton";
import AnimatedInput from "../../components/AnimatedInput";
import ReportError from "../../functions/ReportError";
import Background from "../../components/Background";
import { getAuth } from "firebase/auth";

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

const validFuelType = (fuelType) => {
  if (
    fuelType.toLowerCase() === "regular" ||
    fuelType.toLowerCase() === "midgrade" ||
    fuelType.toLowerCase() === "premium" ||
    fuelType.toLowerCase() === "diesel"
  )
    return true;
  return false;
};
export default function CreateCar() {
  const navigation = useNavigation();
  const [carName, setCarName] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState();
  const [color, setColor] = useState("");
  const [LPN, setLPN] = useState("");
  const [fuelType, setFuelType] = useState("");
  const makeRef = useRef();
  const modelRef = useRef();
  const yearRef = useRef();
  const colorRef = useRef();
  const LPRef = useRef();
  const fuelTypeRef = useRef();
  const auth = getAuth();

  const addCar = async () => {
    if (!make || !model || !year || !color || !LPN || !fuelType || !carName) {
      Alert.alert("Please make sure every field is completed.");
      return;
    }
    if (!validFuelType(fuelType))
      return Alert.alert(
        "Please type 'Regular', 'Midgrade', 'Premium', or 'Diesel' for the fuel type"
      );

    try {
      const db = getFirestore();
      const userDoc = doc(db, "Users", auth.currentUser.email);
      const car = {
        make: make.charAt(0).toUpperCase() + make.slice(1).toLowerCase(),
        model: model.charAt(0).toUpperCase() + model.slice(1).toLowerCase(),
        year: year,
        color: color.charAt(0).toUpperCase() + color.slice(1).toLowerCase(),
        licensePlateNumber: LPN.toUpperCase(),
        fuelType:
          fuelType.charAt(0).toUpperCase() + fuelType.slice(1).toLowerCase(),
      };
      await updateDoc(userDoc, { cars: { [`${carName}`]: car } })
        .then(() => {})
        .catch((error) => ReportError(error));
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
            placeholder="Name Your Car"
            value={carName}
            setValue={setCarName}
            blurOnSubmit={false}
            onSubmitEditing={() => makeRef.current?.focus()}
          />
          <AnimatedInput
            ref={makeRef}
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

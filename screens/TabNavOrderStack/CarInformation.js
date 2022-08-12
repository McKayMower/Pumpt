import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, StyleSheet, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { text } from "../../styles";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/CustomButton";
import AnimatedInput from "../../components/AnimatedInput";
import ReportError from "../../functions/ReportError";
import Background from "../../components/Background";

export default function Order() {
  const [selectedCar, setSelectedCar] = useState();
  const [carName, setCarName] = useState();
  const [carLocation, setCarLocation] = useState();
  const [makeModelYear, setMakeModelYear] = useState();
  const [color, setColor] = useState();
  const [LPN, setLPN] = useState();
  const [fuelType, setFuelType] = useState();
  const [carZipcode, setCarZipcode] = useState();
  const navigation = useNavigation();

  const fetchCarLocation = async () => {
    try {
      const storedCarLocation = await AsyncStorage.getItem("carLocation");
      const storedCarZipcode = await AsyncStorage.getItem("carZipcode");
      if (storedCarZipcode !== null) setCarZipcode(storedCarZipcode);
      if (storedCarLocation !== null) setCarLocation(storedCarLocation);
    } catch (error) {
      ReportError(error);
    }
  };

  const getUserData = async () => {
    //get all user information for autofill
    try {
      const db = getFirestore();
      const auth = getAuth();
      const userDoc = doc(db, "Users", auth.currentUser.email);
      await getDoc(userDoc).then((snapshot) => {
        if (!snapshot.exists) return;
        const carInfo = snapshot.data();
        // Object.keys(carInfo.cars).forEach((car) => console.log(car));
        const name = Object.keys(carInfo.cars)[0];
        const firstCar = carInfo.cars[name];
        setSelectedCar(firstCar);
        setCarName(name);
        setMakeModelYear(
          `${firstCar.make}, ${firstCar.model}, ${firstCar.year}`
        );
        setColor(`${firstCar.color}`);
        setLPN(`${firstCar.licensePlateNumber}`);
        setFuelType(`${firstCar.fuelType}`);
      });
    } catch (error) {
      ReportError(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", (e) => {
      fetchCarLocation();
    });

    return unsubscribe;
  }, [navigation]);

  const confirmPressed = () => {
    navigation.navigate("Confirm Order", {
      selectedCar: selectedCar,
      name: carName,
      location: carLocation,
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
          <Text style={text.screenHeader}>Select Your Car!</Text>
          <AnimatedInput
            placeholder="Car Location"
            value={carLocation}
            setValue={setCarLocation}
          />
          <AnimatedInput
            placeholder="Make, Model, Year"
            value={makeModelYear}
            setValue={setMakeModelYear}
          />
          <AnimatedInput
            placeholder="Color"
            value={color}
            setValue={setColor}
          />
          <AnimatedInput
            placeholder="License Plate"
            value={LPN}
            setValue={setLPN}
            maxLength={8}
          />
          <AnimatedInput
            placeholder="Fuel Type"
            value={fuelType}
            setValue={setFuelType}
            pickerType="Fuel Type"
          ></AnimatedInput>
          <CustomButton
            type="primary"
            text={`Confirm`}
            onPress={confirmPressed}
          />
          <CustomButton
            type="secondary"
            text={`Go Back`}
            onPress={navigation.goBack}
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

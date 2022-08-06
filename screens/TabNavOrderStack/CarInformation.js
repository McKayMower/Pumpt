import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, StyleSheet, Alert } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { REACT_APP_PUMPT_API_URL } from "@env";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomButton from "../../components/CustomButton";
import AnimatedInput from "../../components/AnimatedInput";
import ReportError from "../../functions/ReportError";
import Background from "../../components/Background";
import { text } from "../../styles";

export default function Order() {
  const [carLocation, setCarLocation] = useState();
  const [makeModelYear, setMakeModelYear] = useState();
  const [color, setColor] = useState();
  const [LPN, setLPN] = useState();
  const [fuelType, setFuelType] = useState();
  const stripe = useStripe();
  const navigation = useNavigation();

  const fetchCarLocation = async () => {
    try {
      const storedCarLocation = await AsyncStorage.getItem("carLocation");
      if (storedCarLocation !== null) setCarLocation(storedCarLocation);
    } catch (error) {
      ReportError(error);
    }
  };

  const getUserData = async () => {
    //get all user information for autofill
    try {
      const storedCarLocation = await AsyncStorage.getItem("carLocation");
      const storedMake = await AsyncStorage.getItem("make");
      const storedModel = await AsyncStorage.getItem("model");
      const storedYear = await AsyncStorage.getItem("year");
      const storedColor = await AsyncStorage.getItem("color");
      const storedLPN = await AsyncStorage.getItem("LPN");
      const storedFuelType = await AsyncStorage.getItem("fuelType");
      if (storedCarLocation !== null) setCarLocation(storedCarLocation);
      if (storedMake !== null && storedModel !== null && storedYear !== null)
        setMakeModelYear(`${storedMake}, ${storedModel}, ${storedYear}`);
      if (storedColor !== null) setColor(storedColor);
      if (storedLPN !== null) setLPN(storedLPN);
      if (storedFuelType !== null) setFuelType(storedFuelType);
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

  const pay = async () => {
    // const billingDetails = {
    //   name: fullname,
    //   email: email,
    //   //phone: auth.currentUser.phoneNumber
    //   //address: user address
    // };

    if (!carLocation || !makeModelYear || !color || !LPN || !fuelType) {
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
    const body = {
      location: carLocation,
      makeModelYear: makeModelYear,
      color: color,
      LPN: LPN,
      fuelType: fuelType.toLowerCase(),
    };
    /*
    *
    save car to async storage here
    *
    */
    await axios
      .post(`${REACT_APP_PUMPT_API_URL}/pay`, body)
      .then(async (res) => {
        const clientSecret = res.data.clientSecret;
        await stripe
          .initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            // style: "alwaysLight",
            // billingDetails: billingDetails,
          })
          .then(async (res) => {
            await stripe
              .presentPaymentSheet({
                clientSecret,
              })
              .then((res) => {
                if (res.error) return;
                else Alert.alert("Thank you for the payment");
              })
              .catch((error) => {
                ReportError(error);
              });
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
          <Text style={text.screenHeader}>Verify Car Information!</Text>
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
          />
          <CustomButton type="primary" text={`Get Pumpt!`} onPress={pay} />
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
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#051c60",
    marginVertical: "10%",
  },
});

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { border, colors, text } from "../../styles";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/CustomButton";
import AnimatedInput from "../../components/AnimatedInput";
import ReportError from "../../functions/ReportError";
import Background from "../../components/Background";
import { Feather } from "react-native-vector-icons";

export default function CarSelect({ route }) {
  const [carLocation, setCarLocation] = useState("");
  const [carZipcode, setCarZipcode] = useState("");
  const [carList, setCarList] = useState([]);
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
    try {
      const db = getFirestore();
      const auth = getAuth();
      const userDoc = doc(db, "Users", auth.currentUser.email);
      await getDoc(userDoc).then((snapshot) => {
        if (!snapshot.exists) return;
        setCarList(snapshot.data().carList);
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

  const onCarPicked = (car) => {
    navigation.navigate("Confirm", {
      selectedCar: car,
      location: carLocation,
      day: route.params.day,
      time: route.params.time,
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
          {carList.map((car, idx) => (
            <View
              key={idx}
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={styles.carListContainer}
                onPress={() => onCarPicked(car)}
              >
                <Text style={styles.carNameText}>{car.name}</Text>
                <Feather
                  name="chevron-right"
                  style={styles.iconStyle}
                  size={styles.iconStyle.size}
                />
              </TouchableOpacity>
            </View>
          ))}

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
  carListContainer: {
    alignItems: "center",
    flexDirection: "row",
    width: "80%",
    borderBottomWidth: 1,
    marginVertical: "2.5%",
    padding: "5%",
    fontSize: 18,
    borderColor: colors.borderColor,
    borderRadius: border.borderRadius,
  },
  iconStyle: {
    color: colors.textInput.iconColor,
    size: 30,
    position: "absolute",
    right: "2.5%",
  },
  carNameText: {
    fontSize: 18,
    color: "white",
  },
});

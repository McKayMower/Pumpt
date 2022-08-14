import { useNavigation } from "@react-navigation/native";
import { Text, SafeAreaView, StyleSheet } from "react-native";
import AnimatedInput from "../../components/AnimatedInput";
import CustomButton from "../../components/CustomButton";
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Background from "../../components/Background";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import ReportError from "../../functions/ReportError";
import { colors, text } from "../../styles";
export default function AddCar({ route }) {
  const navigation = useNavigation();
  const [carName, setCarName] = useState();
  const [make, setMake] = useState();
  const [model, setModel] = useState();
  const [year, setYear] = useState("");
  const [color, setColor] = useState();
  const [LPN, setLPN] = useState();
  const [fuelType, setFuelType] = useState();

  const ConfirmEdit = async () => {
    const db = getFirestore();
    const auth = getAuth();
    const userDoc = doc(db, "Users", auth.currentUser.email);
    const newCar = {
      name: carName,
      make: make.charAt(0).toUpperCase() + make.slice(1).toLowerCase(),
      model: model.charAt(0).toUpperCase() + model.slice(1).toLowerCase(),
      year: year,
      color: color.charAt(0).toUpperCase() + color.slice(1).toLowerCase(),
      licensePlateNumber: LPN.toUpperCase(),
      fuelType:
        fuelType.charAt(0).toUpperCase() + fuelType.slice(1).toLowerCase(),
    };
    await updateDoc(userDoc, {
      carList: arrayUnion(newCar),
    })
      .then(() =>
        navigation.navigate("Schedule", {
          car: newCar,
          carLocation: route.params.carLocation,
        })
      )
      .catch((error) => ReportError(error));
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
          <AnimatedInput
            placeholder="Name Your Car"
            value={carName}
            setValue={setCarName}
          />
          <AnimatedInput placeholder="Make" value={make} setValue={setMake} />
          <AnimatedInput
            placeholder="Model"
            value={model}
            setValue={setModel}
          />
          <AnimatedInput
            placeholder="Year"
            value={year}
            setValue={setYear}
            maxLength={4}
            keyboardType="number-pad"
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
          <CustomButton type="primary" text={"Add Car"} onPress={ConfirmEdit} />
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
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.quaternaryText,
    alignSelf: "center",
  },
});

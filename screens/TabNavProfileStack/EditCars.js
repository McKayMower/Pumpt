import { useState } from "react";
import CustomButton from "../../components/CustomButton";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Background from "../../components/Background";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Touchable,
} from "react-native";
import { text } from "../../styles";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { Feather } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function EditCars() {
  const [carList, setCarList] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const db = getFirestore();
      const auth = getAuth();
      const userDoc = doc(db, "Users", auth.currentUser.email);
      await getDoc(userDoc).then((snapshot) => {
        if (!snapshot.exists) return alert("No cars were found");
        setCarList(snapshot.data().carList);
      });
    })();
  }, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Background>
        <SafeAreaView style={styles.container}>
          <Text style={text.screenHeader}>Edit Your Cars!</Text>
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
                onPress={() =>
                  navigation.navigate("Edit Car", { car: car, add: false })
                }
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
          <TouchableOpacity
            style={styles.carListContainer}
            onPress={() =>
              navigation.navigate("Edit Car", { car: {}, add: true })
            }
          >
            <Text style={styles.carNameText}>Add Another...</Text>
            <Feather
              name="plus"
              style={styles.iconStyle}
              size={styles.iconStyle.size}
            />
          </TouchableOpacity>
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

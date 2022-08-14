import { Text, View, StyleSheet, SafeAreaView, Image } from "react-native";
import { getAuth } from "firebase/auth";
import Background from "../components/Background";
import { colors } from "../styles";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getDoc, getFirestore, doc } from "firebase/firestore";

export default function Home() {
  const navigation = useNavigation();
  const auth = getAuth();
  const [carList, setCarList] = useState([]);
  useEffect(() => {
    (async () => {
      const db = getFirestore();
      const userDoc = doc(db, "Users", auth.currentUser.email);
      await getDoc(userDoc).then((snapshot) => {
        if (!snapshot.exists) return;
        setCarList(snapshot.data().carList);
      });
    })();
  }, []);
  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <Text style={styles.welcomeText}>
          Welcome, {auth.currentUser.displayName}
        </Text>
        <View style={styles.logoView}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
        </View>
        <Text style={styles.welcomeText}>Gas, Delivered.</Text>
        <Text style={styles.welcomeText}>
          Step 1: Pin Your Car On The Map {"\n"}
          Step 2: Select The Car You Want To Fill{"\n"}
          Step 3: Schedule A Time With Us
        </Text>
        <CustomButton
          type="primary"
          text="Get Pumpt!"
          onPress={() => navigation.navigate("Funnel Stack", { cars: carList })}
        />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    height: "75%",
    resizeMode: "contain",
  },
  logoView: {
    width: "80%",
    height: "45%",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    marginVertical: "2.5%",
    color: colors.quaternaryText,
    fontSize: 18,
  },
});

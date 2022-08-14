import React, { useEffect, useState } from "react";
import { SafeAreaView, Alert, StyleSheet, Text, View } from "react-native";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut, reload } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import ReportError from "../../functions/ReportError";
import Background from "../../components/Background";
import { colors, text } from "../../styles";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export default function Profile() {
  const auth = getAuth();
  const [name, setName] = useState(auth.currentUser.displayName);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async (e) => {
      // Prevent default behavior
      //e.preventDefault();

      // Do something manually
      const db = getFirestore();
      const userDoc = doc(db, "Users", auth.currentUser.email);
      await getDoc(userDoc).then((snapshot) => {
        if (snapshot.exists) setName(snapshot.data().name);
      });
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => ReportError(error));
  };

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        {/* <FocusAwareStatusBar barStyle={"dark-content"} /> */}
        <Ionicons
          name="md-person-circle-outline"
          size={80}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={text.profileText}>Name: {name}</Text>
          <Text style={text.profileText}>Email: {auth.currentUser.email}</Text>
          <Text style={text.profileText}>
            Email Verified: {auth.currentUser.emailVerified ? "Yes" : "No"}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            text="Update Name"
            type="primary"
            onPress={() => {
              navigation.navigate("Change Name");
            }}
          />
          <CustomButton
            text="Update Password"
            type="primary"
            onPress={() => {
              navigation.navigate("Change Password");
            }}
          />
          <CustomButton
            text="Edit Cars"
            type="primary"
            onPress={() => {
              navigation.navigate("Edit Cars");
            }}
          />

          <CustomButton text="Logout" type="secondary" onPress={handleLogout} />
          <CustomButton
            text="Delete My Account"
            type="tertiary"
            onPress={() => {
              navigation.navigate("Delete Account");
            }}
          />
        </View>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: colors.screenHeader.color,
    marginTop: "5%",
  },
  textContainer: {
    alignItems: "center",
    marginVertical: "5%",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  text: {
    fontSize: 20,
  },
});

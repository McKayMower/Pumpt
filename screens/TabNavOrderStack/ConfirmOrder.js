import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Alert,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { button, colors, text } from "../../styles";
import { useStripe } from "@stripe/stripe-react-native";
import { REACT_APP_PUMPT_API_URL } from "@env";
import { getAuth } from "firebase/auth";
import CustomButton from "../../components/CustomButton";
import Background from "../../components/Background";
import axios from "axios";
import ReportError from "../../functions/ReportError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";

export default function ConfirmOrder({ route }) {
  const navigation = useNavigation();
  const db = getFirestore();
  const auth = getAuth();

  const { selectedCar, name, location } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState();
  const [time, setTime] = useState();
  const [car, setCar] = useState(selectedCar);
  const carLocation = location;
  const carName = name;

  const billingDetails = {
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    address: {
      country: "US",
    },
  };

  useEffect(() => {
    (async () => {
      const storedDay = await AsyncStorage.getItem("day");
      const storedTime = await AsyncStorage.getItem("time");
      if (storedDay === null || storedTime === null) {
        alert("An error occurred with scheduling. Please retry.");
        navigation.navigate("Schedule");
      }
      setDay(storedDay);
      setTime(storedTime);
      setCar(selectedCar);
    })();
    initializePaymentSheet();
  }, []);

  const initializePaymentSheet = async () => {
    const customer = await lookupCustomer();

    // console.log("customer from lookup: ", customer);
    const body = {
      customer: customer,
    };

    await axios
      .post(`${REACT_APP_PUMPT_API_URL}/payment-sheet`, body)
      .then(async (res) => {
        const { setupIntent, ephemeralKey, customerID } = res.data;
        await initPaymentSheet({
          customerId: customerID,
          setupIntentClientSecret: setupIntent,
          customerEphemeralKeySecret: ephemeralKey,
          defaultBillingDetails: billingDetails,
          appearance: {
            colors: {
              light: { primary: "#85ff87" },
              dark: { primary: "#85ff87" },
            },
          },
        })
          .then(({ error }) => (!error ? setLoading(true) : console.log(error)))
          .catch((error) => ReportError(error));
      })
      .catch((error) => ReportError(error));
  };

  const createCustomer = async () => {
    await axios
      .post(`${REACT_APP_PUMPT_API_URL}/create-customer`, billingDetails)
      .then(async (res) => {
        console.log("created customer: ", res.data.customer);
        const newDoc = doc(db, "Users", auth.currentUser.email);
        await updateDoc(newDoc, { stripeCustomerId: res.data.customer.id });
      })
      .catch((error) => ReportError(error));
  };

  //returns a stripe customer object
  const lookupCustomer = async () => {
    let ID;
    const userDoc = doc(db, "Users", auth.currentUser.email);
    await getDoc(userDoc)
      .then((snapshot) => {
        if (snapshot.exists) {
          ID = snapshot.data().stripeCustomerId;
        }
        // console.log("ID from db", ID);
        !ID && createCustomer();
      })
      .catch((error) => {
        return ReportError(error);
      });
    let customer;
    await axios
      .get(`${REACT_APP_PUMPT_API_URL}/retrieve-customer/${ID}`, billingDetails)
      .then((res) => {
        // console.log("returning from lookup: ", res.data.customer);
        customer = res.data.customer;
      })
      .catch((error) => {
        return ReportError(error);
      });

    return customer;
  };

  const openPaymentSheet = async () => {
    await presentPaymentSheet()
      .then(({ error }) => {
        //send customer ID to a client list on server. Can list it in worker app.
        if (!error) {
          Alert.alert(
            "Success",
            "Your payment method has been saved. You will be charged when we fill your tank."
          );
          setLoading(false);
        }
      })
      .catch((error) => ReportError(error));
  };
  const onStripePressed = () => {
    Linking.openURL("https://stripe.com/gb");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Background>
        <SafeAreaView style={styles.container}>
          <Text style={text.screenHeader}>Confirm Your Fillup!</Text>
          <Text style={[text.profileText, styles.scheduleText]}>
            Your Next Fill Up: <Text style={styles.pickedText}>{day}</Text>{" "}
            {"\n"}
            Between: <Text style={styles.pickedText}>{time}</Text>
          </Text>
          <Text style={[text.profileText, styles.scheduleText]}>
            For {carName}:
            <Text style={styles.pickedText}>
              {"\n\t"}
              Make: {car.make}
              {"\n\t"}
              Model: {car.model}
              {"\n\t"}
              Year: {car.year}
              {"\n\t"}
              Color: {car.color}
              {"\n\t"}
              License Plate Number: {car.licensePlateNumber}
              {"\n\t"}
              Fuel Type: {car.fuelType}
            </Text>
          </Text>
          <Text style={[text.profileText, styles.scheduleText]}>
            Location: <Text style={styles.pickedText}>{carLocation}</Text>
          </Text>
          <View style={styles.disclaimerContainer}>
            <Text
              style={[
                button.text_quaternary,
                { textAlign: "justify", marginVertical: "10%" },
              ]}
            >
              <Text style={{ fontWeight: "bold", color: colors.logoColor }}>
                Note:
              </Text>{" "}
              Pumpt does not store or hold any payment details given by our
              users. Payment information is entirely handled and processed
              through {""}
              <Text style={button.text_tertiary} onPress={onStripePressed}>
                Stripe
              </Text>{" "}
              and your payment will be charged after we fill you up.
            </Text>
          </View>

          <CustomButton
            disabled={!loading}
            type="primary"
            text={`Get Pumpt!`}
            onPress={openPaymentSheet}
          />
          <CustomButton
            type="secondary"
            text={`Go Back`}
            onPress={navigation.goBack}
          />
        </SafeAreaView>
      </Background>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  disclaimerContainer: {
    width: "80%",
    marginBottom: "2.5%",
  },
  scheduleText: {
    width: "80%",
    textAlign: "justify",
    fontWeight: "bold",
  },
  pickedText: {
    fontWeight: "normal",
  },
});

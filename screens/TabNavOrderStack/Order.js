import { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, Alert } from "react-native";
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
export default function Card() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();

  const billingDetails = {
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    address: {
      country: "US",
    },
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const initializePaymentSheet = async () => {
    //put body to get the correct customer (through email?)
    const customer = await lookupCustomer();
    // console.log("customer in init", customer);
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
              light: { primary: "#ffffff" },
              dark: { primary: "#ffffff" },
            },
          },
        })
          .then(({ error }) => !error && setLoading(true))
          .catch((error) => ReportError(error));
      })
      .catch((error) => ReportError(error));
  };

  const createCustomer = async () => {
    let customer;
    await axios
      .post(`${REACT_APP_PUMPT_API_URL}/create-customer`, billingDetails)
      .then(async (res) => {
        await AsyncStorage.setItem("customerID", res.data.customer.id);
        customer = createResult.data.customer;
      })
      .catch((error) => ReportError(error));
    return customer;
  };

  //returns a stripe customer object
  const lookupCustomer = async () => {
    let storedID = await AsyncStorage.getItem("customerID");
    let customer;
    if (storedID === null) {
      // console.log("stored ID does not exist, creating customer");
      customer = createCustomer();
    }
    //retrieve customer based off id
    // console.log("storedID: ", storedID);
    await axios
      .get(
        `${REACT_APP_PUMPT_API_URL}/retrieve-customer/${storedID}`,
        billingDetails
      )
      .then((res) => {
        // console.log("returning from lookup: ", res.data.customer);
        customer = res.data.customer;
      })
      .catch((error) => ReportError(error));

    return customer;
  };

  const openPaymentSheet = async () => {
    await presentPaymentSheet()
      .then(({ error }) => {
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
    console.log("redirect to stripe's webpage");
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
          <Text style={text.screenHeader}>Confirm Order!</Text>
          <View style={styles.disclaimerContainer}>
            <Text style={[button.text_quaternary, { textAlign: "justify" }]}>
              <Text style={{ fontWeight: "bold", color: colors.logoColor }}>
                Note:
              </Text>{" "}
              Pumpt does not store or hold any card details given by our users.
              Payment information is entirely handled and processed through {""}
              <Text style={button.text_tertiary} onPress={onStripePressed}>
                Stripe
              </Text>{" "}
              and your card will be charged after we fill you up.
            </Text>
          </View>

          <CustomButton
            disabled={!loading}
            type="primary"
            text={`Confirm Order`}
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
});

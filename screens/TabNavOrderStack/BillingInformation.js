import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView, Text, StyleSheet, Alert, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import AnimatedInput from "../../components/AnimatedInput";
import CustomButton from "../../components/CustomButton";
import Background from "../../components/Background";
import { border, colors, text } from "../../styles";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

export default function BillingInformation() {
  const [systemDate, setSystemDate] = useState(
    new Date("2022-08-07T14:30:00.000Z")
  );
  const [pickedDate, setPickedDate] = useState();
  const [pickedTime, setPickedTime] = useState();
  const [fullname, setFullname] = useState();
  const [email, setEmail] = useState();
  const [homeAddress, setHomeAdress] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = () => {
    auth.currentUser.displayName && setFullname(auth.currentUser.displayName);
    auth.currentUser.email && setEmail(auth.currentUser.email);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log(date);
    setPickedDate(moment(date).format("MMMM Do, YYYY"));
    setPickedTime(
      moment(date).format("h:mma") +
        "-" +
        moment(date).add(1, "hour").format("h:mma")
    );
    hideDatePicker();
  };

  const verifyCarPressed = () => {
    console.log("Store??? Send time information to server")
    navigation.navigate("Car Information");
  };
  return (
    <View
      // contentContainerStyle={{
      //   flex: 1,
      //   justifyContent: "center",
      // }}
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Background>
        <SafeAreaView style={styles.container}>
          <Text style={text.screenHeader}>Schedule Us!</Text>
          <DateTimePickerModal
            value={systemDate}
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            display="inline"
            buttonTextColorIOS={colors.logoColor}
            minimumDate={new Date()}
            accentColor={colors.quaternaryText}
            minuteInterval={15}
          />
          <CustomButton
            type="primary"
            text={pickedDate && pickedTime ? "Change Date" : "Select a Date"}
            onPress={showDatePicker}
          />
          <Text style={text.profileText}>Your Next Fillup: {pickedDate}</Text>
          <Text style={text.profileText}>
            Your 1-hour time window: {pickedTime}
          </Text>
          <CustomButton
            type="primary"
            text="Verify Car Information"
            onPress={verifyCarPressed}
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
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#051c60",
    marginVertical: "10%",
  },
});

import { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, text } from "../../styles";
import CustomButton from "../../components/CustomButton";
import Background from "../../components/Background";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

export default function Schedule() {
  const [initialDate, setInitialDate] = useState();
  const [pickedDate, setPickedDate] = useState("Select a date");
  const [pickedTime, setPickedTime] = useState("Select a date");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    setInitialDate(calculateNearestValidDate());
  }, []);

  const navigation = useNavigation();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const calculateNearestValidDate = () => {
    const startDate = moment();
    const remainder = 15 - (startDate.minute() % 15);
    const newDate = moment(startDate).add(remainder, "minutes").toDate();
    return new Date(newDate);
  };
  const handleConfirm = (date) => {
    setPickedDate(moment(date).format("MMMM Do, YYYY"));
    setPickedTime(
      moment(date).format("h:mma") +
        "-" +
        moment(date).add(1, "hour").format("h:mma")
    );
    hideDatePicker();
  };

  const verifyCarPressed = () => {
    console.log("Store??? Send time information to server");
    navigation.navigate("Car Information");
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
          <Text style={text.screenHeader}>Schedule Us!</Text>
          <DateTimePickerModal
            value={new Date()}
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            display="inline"
            buttonTextColorIOS={colors.logoColor}
            minimumDate={new Date()}
            maximumDate={new Date(moment().add(21, "days").toDate())}
            accentColor={colors.quaternaryText}
            minuteInterval={15}
            date={initialDate}
            onChange={(date) => {
              setInitialDate(date);
              setPickedDate(moment(date).format("MMMM Do, YYYY"));
              setPickedTime(
                moment(date).format("h:mma") +
                  "-" +
                  moment(date).add(1, "hour").format("h:mma")
              );
            }}
          />
          <CustomButton
            type="primary"
            text={
              pickedDate !== "Select a date" && pickedTime !== "Select a date"
                ? "Change Date"
                : "Select a Date"
            }
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

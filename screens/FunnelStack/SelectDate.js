import { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, Alert } from "react-native";
import { TabRouter, useNavigation } from "@react-navigation/native";
import { colors, text } from "../../styles";
import CustomButton from "../../components/CustomButton";
import Background from "../../components/Background";
import moment from "moment";
import ScheduleModal from "../../components/ScheduleModal";

export default function Schedule({ route }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickedDate, setPickedDate] = useState("Schedule a Day");
  const [pickedTime, setPickedTime] = useState("Schedule a Time");
  const navigation = useNavigation();
  const [initialDate, setInitialDate] = useState();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setPickedDate(moment(date).format("MMMM Do, YYYY"));
    setPickedTime(
      moment(date).format("h:mma") +
        "-" +
        moment(date).add(1, "hour").format("h:mma")
    );
    hideDatePicker();
    navigation.navigate("Confirm", {
      day:
        pickedDate === "Schedule a Day"
          ? moment(date).format("MMMM Do, YYYY")
          : pickedDate,
      time:
        pickedTime === "Schedule a Time"
          ? moment(date).format("h:mma") +
            "-" +
            moment(date).add(1, "hour").format("h:mma")
          : pickedTime,
      selectedCar: route.params.car,
      location: route.params.carLocation,
    });
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
          <Text style={text.screenHeader}>Schedule A Date!</Text>
          <View style={styles.textView}>
            <Text style={[text.profileText, styles.scheduleText]}>
              Your Next Fill Up:{" "}
              <Text style={styles.pickedText}>{pickedDate}</Text> {"\n"}
              Between: <Text style={styles.pickedText}>{pickedTime}</Text>
            </Text>
          </View>
          <CustomButton
            type="primary"
            text={
              pickedDate !== "Schedule a Day" &&
              pickedTime !== "Schedule a Time"
                ? "Change Date"
                : "Schedule Here"
            }
            onPress={showDatePicker}
          />
          <ScheduleModal
            isVisible={isDatePickerVisible}
            onCancel={hideDatePicker}
            onConfirm={handleConfirm}
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
            type="secondary"
            text="Go Back"
            onPress={() => navigation.navigate("Map")}
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
  scheduleText: {
    width: "80%",
    textAlign: "justify",
    fontWeight: "bold",
  },
  pickedText: {
    fontWeight: "normal",
  },
  textView: {
    marginVertical: "2.5%",
    justifyContent: "center",
  },
});

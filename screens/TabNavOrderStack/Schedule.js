import { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, text } from "../../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/CustomButton";
import Background from "../../components/Background";
import moment from "moment";
import ScheduleModal from "../../components/ScheduleModal";
import { NotoSansNewTaiLue_400Regular } from "@expo-google-fonts/dev";

export default function Schedule() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickedDate, setPickedDate] = useState("Schedule a Date");
  const [pickedTime, setPickedTime] = useState("Schedule a Date");
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
  };

  const verifyCarPressed = async () => {
    if (pickedDate === "Schedule a Date") {
      Alert.alert(
        "Please Schedule a Date and a 1-hour time window for us to fill up your vehicle."
      );
      return;
    }
    try {
      await AsyncStorage.setItem("day", pickedDate);
      await AsyncStorage.setItem("time", pickedTime);
    } catch (error) {
      ReportError(error);
    }
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
          <Text style={text.screenHeader}>Ready? Schedule Us!</Text>
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
              pickedDate !== "Schedule a Date" &&
              pickedTime !== "Schedule a Date"
                ? "Change Date"
                : "Schedule A Date Here"
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
  },
});

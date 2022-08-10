import { useState, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { colors } from "../styles";
import moment from "moment";
export default function ScheduleModal(props) {
  const [initialDate, setInitialDate] = useState();

  const calculateNearestValidTimeInterval = () => {
    const startDate = moment();
    const remainder = 15 - (startDate.minute() % 15);
    const newDate = moment(startDate).add(remainder, "minutes").toDate();
    return new Date(newDate);
  };

  useEffect(() => {
    setInitialDate(calculateNearestValidTimeInterval());
  }, []);
  return (
    <DateTimePickerModal
      isVisible={props.isVisible}
      mode="datetime"
      onConfirm={props.onConfirm}
      onCancel={props.onCancel}
      display="inline"
      buttonTextColorIOS={colors.logoColor}
      minimumDate={new Date()}
      maximumDate={new Date(moment().add(21, "days").toDate())}
      accentColor={colors.quaternaryText}
      minuteInterval={15}
      date={initialDate}
      onChange={props.onChange}
    />
  );
}

import { Text, TouchableOpacity } from "react-native";
import React from "react";
import * as Haptics from "expo-haptics";
import { border, button, colors } from "../styles";
//if no type is given, it will default to primary
//const CustomButton = ({type='primary'}) => {

const CustomButton = (props) => {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={() => {
        props.onPress();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }}
      style={{
        width: "80%",
        padding: "5%",
        marginVertical: "2.5%",
        alignItems: "center",
        alignSelf: "center",
        position: "absolute",
        backgroundColor: colors.textInput.backgroundColor,
        borderRadius: border.borderRadius,
        bottom: "8%",
      }}
    >
      <Text
        style={[
          button.text,
          button[`text_${props.type}`],
          props.color ? { color: props.color } : {},
        ]}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

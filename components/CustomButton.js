import { Text, TouchableOpacity } from "react-native";
import React from "react";
import * as Haptics from "expo-haptics";
import { text, button } from "../styles";
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
      style={[
        button.container,
        button[`container_${props.type}`],
        props.backgroundColor ? { backgroundColor: props.backgroundColor } : {},
      ]}
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

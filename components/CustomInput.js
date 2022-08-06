import { View, TextInput } from "react-native";
import { useState, forwardRef } from "react";
import { Feather } from "react-native-vector-icons";
import React from "react";
import { colors, textInput } from "../styles";
import * as Haptics from "expo-haptics";

const CustomInput = forwardRef((props, ref) => {
  const [borderColor, setBorderColor] = useState(colors.borderColor);

  return (
    <View style={[textInput.container, { borderColor: borderColor }]}>
      {(props.placeholder === "Username" ||
        props.placeholder === "Full Name" ||
        props.placeholder === "First Name" ||
        props.placeholder === "New First Name") && (
        <Feather
          style={textInput.iconStyle}
          name="user"
          size={textInput.iconSize}
          color={textInput.iconColor}
        />
      )}
      {(props.placeholder === "New Last Name" ||
        props.placeholder === "Last Name") && (
        <Feather
          style={textInput.iconStyle}
          name="users"
          size={textInput.iconSize}
          color={textInput.iconColor}
        />
      )}
      {props.placeholder === "Email" && (
        <Feather
          style={textInput.iconStyle}
          name="mail"
          size={textInput.iconSize}
          color={textInput.iconColor}
        />
      )}
      {props.placeholder === "Phone Number" && (
        <Feather
          style={textInput.iconStyle}
          name="phone"
          size={textInput.iconSize}
          color={textInput.iconColor}
        />
      )}
      {props.placeholder === "Car Location" && (
        <Feather
          style={textInput.iconStyle}
          name="map-pin"
          size={textInput.iconSize}
          color={textInput.iconColor}
        />
      )}
      {(props.placeholder === "Make" ||
        props.placeholder === "Model" ||
        props.placeholder === "Make, Model, Year") && (
        <Feather
          style={textInput.iconStyle}
          name="truck"
          size={textInput.iconSize}
          color={textInput.iconColor}
        />
      )}
      {props.placeholder === "Year" && (
        <Feather
          style={textInput.iconStyle}
          name="clock"
          size={textInput.iconSize}
          color={textInput.iconColor}
        />
      )}
      {props.placeholder === "Color" && (
        <Feather
          style={textInput.iconStyle}
          name="droplet"
          size={textInput.iconSize}
          color={textInput.iconColor}
        />
      )}
      {props.placeholder === "Fuel Type" && (
        <Feather
          style={textInput.iconStyle}
          name="battery"
          size={textInput.iconSize}
          color={textInput.iconColor}
        />
      )}
      {props.placeholder === "License Plate" && (
        <Feather
          style={textInput.iconStyle}
          name="bookmark"
          size={textInput.iconSize}
          color={textInput.iconColor}
        />
      )}
      {(props.placeholder === "Password" ||
        props.placeholder === "New Password" ||
        props.placeholder === "Repeat Password" ||
        props.placeholder === "Confirm Password" ||
        props.placeholder === "Confirm New Password") && (
        <Feather
          style={textInput.iconStyle}
          name="lock"
          size={textInput.iconSize}
          color={textInput.iconColor}
        />
      )}
      <TextInput
        ref={ref}
        keyboardAppearance="dark"
        maxLength={props.maxLength}
        autoFocus={props.autoFocus}
        blurOnSubmit={props.blurOnSubmit}
        onSubmitEditing={props.onSubmitEditing}
        value={props.value}
        onChangeText={props.setValue}
        placeholder={props.placeholder}
        style={[textInput.style, props.style]}
        secureTextEntry={props.secureTextEntry}
        placeholderTextColor={colors.textInput.placeholderTextColor}
        keyboardType={props.keyboardType}
        returnKeyType={props.returnKeyType ? props.returnKeyType : "done"}
        onFocus={() => {
          setBorderColor(textInput.focusColor);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        onBlur={() => {
          setBorderColor(textInput.blurColor);
        }}
        autoCapitalize="none"
        autoCompleteType={props.autoCompleteType}
        textContentType={props.textContentType}
        onChange={props.onChange}
      />
    </View>
  );
});

export default CustomInput;

CustomInput.defaultProps = {
  ref: null,
  props: null,
};

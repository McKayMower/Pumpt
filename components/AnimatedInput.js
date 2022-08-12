import React, { useState, useRef, useEffect, forwardRef } from "react";
import {
  View,
  Text,
  Easing,
  Animated,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { colors, animatedInput } from "../styles";
import { Feather } from "react-native-vector-icons";

const ChooseName = (placeholder) => {
  switch (placeholder) {
    case "Username":
    case "Full Name":
    case "First Name":
    case "New First Name":
    case "New Name":
      return "user";
    case "New Last Name":
    case "Last Name":
      return "users";
    case "Email":
      return "mail";
    case "Home Address":
    case "Name Your Car":
      return "tag";
    case "Billing Address":
      return "home";
    case "Phone Number":
      return "phone";
    case "Car Location":
      return "map-pin";
    case "Make":
    case "Model":
    case "Make, Model, Year":
      return "truck";
    case "Year":
      return "clock";
    case "Color":
      return "droplet";
    case "Fuel Type":
      return "battery";
    case "License Plate":
      return "bookmark";
    case "Password":
    case "New Password":
    case "Repeat Password":
    case "Current Password":
    case "Confirm Password":
    case "Confirm New Password":
      return "lock";
  }
};

const AnimatedInput = forwardRef((props, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef();
  let iconName = ChooseName(props.placeholder);
  let color = isFocused ? colors.logoColor : colors.quaternaryText;
  if (props.errorText) color = "#b00020";
  useEffect(() => {
    Animated.timing(focusAnimation, {
      toValue: isFocused || !!props.value ? 1 : 0,
      duration: 175,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [focusAnimation, isFocused, props.value]);

  const mergeRef = (...refs) => {
    return (inst) => {
      for (const ref of refs) {
        if (typeof ref === "function") ref(inst);
        else if (ref) ref.current = inst;
      }
    };
  };
  return (
    <View style={[animatedInput.container, { borderColor: color }]}>
      <Feather
        style={animatedInput.iconStyle}
        name={iconName}
        size={animatedInput.iconSize}
        color={animatedInput.iconColor}
      />

      <TextInput
        ref={mergeRef(inputRef, ref)}
        style={[animatedInput.style, props.style]}
        value={props.value}
        onChangeText={props.setValue}
        keyboardAppearance="dark"
        maxLength={props.maxLength}
        autoFocus={props.autoFocus}
        blurOnSubmit={props.blurOnSubmit}
        onSubmitEditing={props.onSubmitEditing}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType}
        autoCorrect={props.autoCorrect}
        clearButtonMode={"while-editing"}
        returnKeyType={props.returnKeyType ? props.returnKeyType : "done"}
        onBlur={(event) => {
          setIsFocused(false);
          // props.onBlur?.(event); //if we need onblur/onfocus events
        }}
        onFocus={(event) => {
          setIsFocused(true);
          // props.onFocus?.(event);
        }}
        autoCompleteType={props.autoCompleteType}
        textContentType={props.textContentType}
      ></TextInput>
      <TouchableOpacity
        activeOpacity={1}
        style={[
          animatedInput.placeholderContainer,
          {
            transform: [
              {
                scale: focusAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.85],
                }),
              },
              {
                translateY: focusAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, -5],
                }),
              },
              {
                translateX: focusAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -60],
                }),
              },
            ],
          },
        ]}
        onPress={() => inputRef.current?.focus()}
      >
        <Text
          style={[
            animatedInput.placeholder,
            {
              color: color,
            },
          ]}
        >
          {props.placeholder}
          {props.errorText && "*"}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export default AnimatedInput;

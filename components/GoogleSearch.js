import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { REACT_APP_MAPS_API_KEY } from "@env";

const GoogleSearch = (props) => {
  return (
    <GooglePlacesAutocomplete
      enablePoweredByContainer={false}
      textInputProps={props.textInputProps}
      debounce={1000}
      ref={props.ref}
      //keepResultsAfterBlur={props.keepResultsAfterBlur}
      minLength={props.minLength}
      placeholder={props.placeholder}
      onPress={props.onPress}
      styles={props.styles}
      query={{
        key: REACT_APP_MAPS_API_KEY,
        language: "en",
        components: "country:us",
      }}
    />
  );
};

export default GoogleSearch;

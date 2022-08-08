import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import { FontAwesome5 } from "react-native-vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import GoogleSearch from "../components/GoogleSearch";
import MapView from "react-native-maps";
import * as Haptics from "expo-haptics";
import { border, colors } from "../styles";
import * as Location from "expo-location";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Map = () => {
  const mapRef = useRef();
  const timerRef = useRef();
  const [searchText, setSearchText] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [findingMe, setFindingMe] = useState(false);
  const [mapMode, setMapMode] = useState("dark");
  const [permissions, setPermissions] = useState({});
  const [mapType, setMapType] = useState("standard");

  useEffect(() => {
    const askForPermissions = async () => {
      const foregroundPermission =
        await Location.requestForegroundPermissionsAsync();
      setPermissions(foregroundPermission);
      if (!foregroundPermission.canAskAgain) {
        Alert.alert(
          "Please allow Pumpt to use your current location: settings -> privacy -> location services -> Pumpt -> 'While Using the App'"
        );
      }
    };
    askForPermissions();
  }, []);

  const changeMapMode = () => {
    if (mapMode === "dark") {
      setMapMode("light");
    } else if (mapMode === "light") {
      setMapType("satellite");
      setMapMode(null);
    } else {
      setMapMode("dark");
      setMapType("standard");
    }
  };

  let textInputProps = {
    keyboardAppearance: "dark",
    placeholderTextColor: colors.textInput.placeholderTextColor,
    onSubmitEditing: () => setSearchFocused(false),
    onFocus: () => setSearchFocused(true),
    onBlur: () => setSearchFocused(false),
    returnKeyType: "search",
    placeholder: "Enter Your Car Location",
    value: searchText,
    onChangeText: (text) => {
      setSearchText(text);
    },
  };

  const handleSearchSubmisison = async (data, details = null) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log(data);
    const coords = await Location.geocodeAsync(data.description);
    const { latitude, longitude } = coords[0];
    const res = await Location.reverseGeocodeAsync({
      latitude: latitude,
      longitude: longitude,
    });
    await AsyncStorage.setItem("carZipcode", `${res[0].postalCode}`);

    const newRegion = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.00375,
      longitudeDelta: 0.00375,
    };

    mapRef.current?.animateToRegion(newRegion, 1000);

    Keyboard.dismiss();
    setSearchFocused(false);
  };

  const handleRegionChangeComplete = async (obj) => {
    if (searchFocused) return;
    if (findingMe) return;
    const { latitude, longitude } = obj;
    const res = await Location.reverseGeocodeAsync({
      latitude: latitude,
      longitude: longitude,
    });
    await AsyncStorage.setItem("carZipcode", `${res[0].postalCode}`);
    if (res[0].name && res[0].city && res[0].region) {
      setSearchText(`${res[0].name}, ${res[0].city}, ${res[0].region}`);
      await AsyncStorage.setItem(
        "carLocation",
        `${res[0].name}, ${res[0].city}, ${res[0].region}`
      );
    } else if (res[0].name && res[0].city) {
      setSearchText(`${res[0].name}, ${res[0].city}`);
      await AsyncStorage.setItem(
        "carLocation",
        `${res[0].name}, ${res[0].city}`
      );
    } else if (res[0].name) {
      setSearchText(res[0].name);
      await AsyncStorage.setItem("carLocation", `${res[0].name}`);
    }
  };

  const findMe = async () => {
    setFindingMe(true);
    if (!permissions.granted || !permissions.canAskAgain) {
      Alert.alert(
        "Please allow Pumpt to use your current location: settings -> privacy -> location services -> Pumpt -> 'While Using the App'"
      );
      return;
    }
    const location = await Location.getCurrentPositionAsync({ accuracy: 6 });

    mapRef.current?.animateToRegion(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.00375,
        longitudeDelta: 0.00375,
      },
      1000
    );

    setFindingMe(false);
  };

  return (
    <View
      style={{
        flex: 1,
        ...StyleSheet.absoluteFillObject,
      }}
    >
      <FocusAwareStatusBar barStyle={"light-content"} />
      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: 40.76069676597343,
          longitude: -111.88878037561432,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        userInterfaceStyle={mapMode}
        mapType={mapType}
        style={styles.map}
        loadingEnabled
        zoomTapEnabled={false}
        showsCompass={false}
        showsUserLocation
        onRegionChangeComplete={(region) => {
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            handleRegionChangeComplete(region);
          }, 250);
        }}
      >
        <View style={styles.carPinView}>
          <Image
            source={require("../assets/car-pin.png")}
            style={styles.carPin}
          />
        </View>
        {/* <FontAwesome5 name="map-pin" style={styles.mapPin} size={50} /> */}
      </MapView>

      <LinearGradient
        // Background Linear Gradient
        colors={["rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0)"]}
        style={styles.linearGradient}
      />
      <GoogleSearch
        styles={searchStyles}
        textInputProps={textInputProps}
        minLength={1}
        onPress={handleSearchSubmisison}
      />
      <View style={styles.mapFMCMContainer}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setFindingMe(true);
            findMe();
          }}
          style={styles.findMe}
        >
          <FontAwesome5
            name="location-arrow"
            size={25}
            style={styles.containerIcons}
          />
        </TouchableOpacity>
        <View style={styles.mapFMCMContainerSeparator}></View>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            changeMapMode();
          }}
          style={styles.changeMapMode}
        >
          <FontAwesome5 name="map" size={25} style={styles.containerIcons} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    justifyContent: "center",
  },
  mapPin: {
    position: "absolute",
    alignSelf: "center",
    paddingBottom: "8%",
    zIndex: 5,
  },
  carPinView: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: "10%",
    bottom: "4.25%",
  },
  carPin: {
    resizeMode: "contain",
    height: "100%",
  },
  mapFMCMContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: width * 0.05,
    bottom: height * 0.15,
    backgroundColor: colors.textInput.backgroundColor,
    borderRadius: border.borderRadius,
    borderWidth: border.borderWidth,
    borderColor: colors.borderColor,
  },
  findMe: {
    flex: 1,
  },
  changeMapMode: {
    flex: 1,
  },
  mapFMCMContainerSeparator: {
    height: 0.5,
    backgroundColor: "rgba(167, 167, 167, 0.8)",
    width: "100%",
  },
  linearGradient: {
    height: "20%",
    width: "100%",
    position: "absolute",
  },
  containerIcons: {
    margin: 10,
    color: colors.navbar.iconColor,
  },
});

const searchStyles = {
  container: {
    flex: 1,
    width: "85%",
    position: "absolute",
    alignSelf: "center",
    top: height * 0.075,
  },
  textInputContainer: {
    flexDirection: "row",
  },
  textInput: {
    backgroundColor: colors.textInput.backgroundColor,
    color: colors.textInput.textColor,
    borderColor: "rgba(167, 167, 167, 0.8)",
    height: 44,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 15,
    flex: 1,
    borderRadius: border.borderRadius,
  },
  poweredContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderColor: "#c8c7cc",
    borderTopWidth: 0.5,
  },
  powered: {},
  listView: {},
  row: {
    backgroundColor: "#FFFFFF",
    padding: 13,
    height: 44,
    flexDirection: "row",
  },
  separator: {
    height: 0.5,
    backgroundColor: "#c8c7cc",
  },
  description: {},
  loader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    height: 20,
  },
};

export default Map;

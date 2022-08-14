import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  Text,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { Feather } from "react-native-vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import GoogleSearch from "../../components/GoogleSearch";
import MapView from "react-native-maps";
import * as Haptics from "expo-haptics";
import { border, colors } from "../../styles";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import MapButton from "../../components/MapButton";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function Map({ route }) {
  const { cars } = route.params;
  const [carList, setCarList] = useState([]);
  const navigation = useNavigation();
  const mapRef = useRef();
  const modalRef = useRef();
  const timerRef = useRef();
  const [carLocation, setCarLocation] = useState({});
  const [carZipcode, setCarZipcode] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [findingMe, setFindingMe] = useState(false);
  const [mapMode, setMapMode] = useState("dark");
  const [permissions, setPermissions] = useState({});
  const [mapType, setMapType] = useState("standard");
  const initialRegion = {
    latitude: 40.76069676597343,
    longitude: -111.88878037561432,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };
  useEffect(() => {
    setCarList(cars);
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
    const coords = await Location.geocodeAsync(data.description);
    const { latitude, longitude } = coords[0];
    const res = await Location.reverseGeocodeAsync({
      latitude: latitude,
      longitude: longitude,
    });

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
    const resat0 = res[0];
    setSearchText(`${resat0.name}, ${resat0.city}, ${resat0.region}`);
    setCarLocation({
      name: resat0.name,
      city: resat0.city,
      zipcode: resat0.postalCode,
      state: resat0.region,
    });
  };

  const findMe = async () => {
    setFindingMe(true);

    if (!permissions.granted || !permissions.canAskAgain) {
      Alert.alert(
        "Please allow Pumpt to use your current location: settings -> privacy -> location services -> Pumpt -> 'While Using the App'"
      );
      setFindingMe(false);
      return;
    }

    // const location = await Location.getCurrentPositionAsync({ accuracy: 6 });
    const location = await Location.getLastKnownPositionAsync({ accuracy: 6 });

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
      <MapView
        ref={mapRef}
        initialRegion={initialRegion}
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
          }, 500);
        }}
      />
      <MapButton
        type="primary"
        text="Confirm"
        color={colors.navbar.iconColor}
        onPress={modalRef.current?.open}
      />
      <Modalize
        ref={modalRef}
        style={{ position: "absolute" }}
        openAnimationConfig={{
          timing: { duration: 560 },
        }}
        handlePosition="inside"
        handleStyle={styles.handle}
        modalStyle={styles.modalStyle}
        adjustToContentHeight={true}
      >
        <Text style={styles.modalTitle}>Select A Car To Fill!</Text>
        <View style={{ alignItems: "center" }}>
          {carList.map((car, idx) => (
            <View
              key={idx}
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={styles.carListContainer}
                onPress={() => {
                  if (
                    !(
                      carLocation.name &&
                      carLocation.zipcode &&
                      carLocation.state &&
                      carLocation.city
                    )
                  )
                    return Alert.alert(
                      "Inavlid Area",
                      "Please select a valid area."
                    );
                  navigation.navigate("Schedule", {
                    car: car,
                    carLocation: carLocation,
                  });
                }}
              >
                <Text style={styles.carNameText}>{car.name}</Text>
                <Feather
                  name="chevron-right"
                  style={styles.iconStyle}
                  size={styles.iconStyle.size}
                />
              </TouchableOpacity>
            </View>
          ))}
          {/* <TouchableOpacity
            style={[styles.carListContainer, { marginBottom: "5%" }]}
            onPress={() =>
              navigation.navigate("Add Car", { carLocation: carLocation })
            }
          >
            <Text style={styles.carNameText}>Add Another...</Text>
            <Feather
              name="plus"
              style={styles.iconStyle}
              size={styles.iconStyle.size}
            />
          </TouchableOpacity> */}
        </View>
        <View style={{ paddingBottom: "15%" }} />
      </Modalize>
      <View style={styles.carPinView}>
        <Image
          source={require("../../assets/car-pin.png")}
          style={styles.carPin}
        />
      </View>
      <LinearGradient
        // Linear Gradient Behind The Search Bar
        colors={["rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0)"]}
        style={styles.linearGradient}
      />
      <View style={styles.searchView}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Feather
            name="chevron-left"
            size={styles.searchBack.size}
            style={styles.searchBack}
          />
        </TouchableOpacity>
        <GoogleSearch
          styles={searchStyles}
          textInputProps={textInputProps}
          minLength={1}
          onPress={handleSearchSubmisison}
        />
      </View>
      <View style={styles.mapFMCMContainer}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setFindingMe(true);
            findMe();
          }}
          style={styles.findMe}
        >
          <Feather
            name="navigation"
            size={styles.containerIcons.size}
            style={styles.containerIcons}
          />
        </TouchableOpacity>
        <View style={styles.mapFMCMContainerSeparator} />
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            changeMapMode();
          }}
          style={styles.changeMapMode}
        >
          <Feather
            name="map"
            size={styles.containerIcons.size}
            style={styles.containerIcons}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    justifyContent: "center",
  },
  carPinView: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: "10%",
    bottom: "50%",
    position: "absolute",
  },
  carPin: {
    resizeMode: "contain",
    height: "100%",
  },
  mapFMCMContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: "5%",
    bottom: "20%",
    backgroundColor: colors.textInput.backgroundColor,
    borderRadius: border.borderRadius,
    borderWidth: border.borderWidth,
    borderColor: colors.borderColor,
    zIndex: 0,
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
    alignSelf: "center",
    margin: 10,
    size: 25,
    color: colors.navbar.iconColor,
  },
  searchView: {
    top: height * 0.075,
    position: "absolute",
    width: "100%",
    justifyContent: "center",
  },
  searchBack: {
    color: "white",
    size: 40,
    left: "2.5%",
    paddingBottom: "1.5%",
  },
  carListContainer: {
    alignItems: "center",
    flexDirection: "row",
    width: "80%",
    borderBottomWidth: 1,
    marginVertical: "2.5%",
    padding: "5%",
    fontSize: 18,
    borderColor: colors.borderColor,
  },
  iconStyle: {
    color: colors.quaternaryText,
    size: 30,
    position: "absolute",
    right: "2.5%",
  },
  carNameText: {
    fontSize: 18,
    color: colors.quaternaryText,
  },
  handle: { backgroundColor: colors.quaternaryText, marginTop: 4 },
  modalTitle: {
    color: colors.quaternaryText,
    alignSelf: "center",
    marginTop: "10%",
    fontSize: 24,
  },
  modalStyle: {
    backgroundColor: colors.backgroundColor,
  },
});

const searchStyles = {
  container: {
    flex: 1,
    width: "70%",
    position: "absolute",
    alignSelf: "center",
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

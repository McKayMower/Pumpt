import { useEffect, useState } from "react";
import { View, StatusBar } from "react-native";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { FjallaOne_400Regular } from "@expo-google-fonts/dev";
import * as SplashScreen from "expo-splash-screen";
import HomeNavigator from "./components/HomeNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FunnelStack from "./screens/FunnelStack/FunnelStack";
import LoginStack from "./screens/LoginStack/LoginStack";
import axios from "axios";
import * as Font from "expo-font";
import {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
  REACT_APP_FIREBASE_MEAUSUREMENT_ID,
  REACT_APP_PUMPT_API_URL,
} from "@env";
import { colors } from "./styles";

const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
  measurementId: REACT_APP_FIREBASE_MEAUSUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [publishableKey, setPublishableKey] = useState();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({ FjallaOne_400Regular });
      } catch {
        console.log("error loading fonts in CustomInput");
      }
    })();

    try {
      const fetchPublishableKey = async () => {
        await axios
          .get(`${REACT_APP_PUMPT_API_URL}/get-publishable-key`)
          .then((res) => {
            setPublishableKey(res.data.publishableKey);
          })
          .catch((error) => {
            console.log(`error in useEffectPublishableKey: ${error}`);
          });
      };
      fetchPublishableKey();
    } catch (e) {
      console.warn(e);
    } finally {
      // Tell the application to render
      setAppIsReady(true);
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && auth.currentUser?.emailVerified) setLoggedIn(true);
      else setLoggedIn(false);
    });
    return unsubscribe;
  }, []);

  const onLayout = async () => {
    if (appIsReady) await SplashScreen.hideAsync();
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.backgroundColor,
      }}
      onLayout={onLayout}
    >
      <StatusBar barStyle="light-content" />
      {loggedIn && (
        <StripeProvider publishableKey={publishableKey}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Home Navigator"
                component={HomeNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Funnel Stack"
                component={FunnelStack}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </StripeProvider>
      )}
      {!loggedIn && (
        <NavigationContainer>
          <LoginStack />
        </NavigationContainer>
      )}
    </View>
  );
}

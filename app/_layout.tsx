// app/_layout.tsx
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import store, { AppDispatch } from "@/redux/store";
import { View, Text } from "react-native";
import FlashMessage from "react-native-flash-message";
import { initializeAuth } from "@/redux/slices/authSlice";

SplashScreen.preventAutoHideAsync();

function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const [authInitialized, setAuthInitialized] = useState(false);
  const [fontsLoaded] = useFonts({
    "Roboto-Mono": require("../assets/fonts/RobotoMono-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        try {
          await dispatch(initializeAuth()).unwrap();
        } catch (error) {
          console.error("Auth initialization failed:", error);
        }
        setAuthInitialized(true);
        SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded, dispatch]);

  if (!fontsLoaded || !authInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <FlashMessage style={{ zIndex: 999 }} />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppInitializer />
      </SafeAreaProvider>
    </Provider>
  );
}

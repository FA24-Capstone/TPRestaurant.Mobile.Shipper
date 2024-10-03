import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { View, Text } from "react-native";
import FlashMessage from "react-native-flash-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const [loaded] = useFonts({
    "Roboto-Mono": require("../assets/fonts/RobotoMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      setFontsLoaded(true);
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <FlashMessage style={{ zIndex: 999 }} />
        <Stack screenOptions={{ headerShown: false }}>
          {/* The default route for index */}
          <Stack.Screen name="index" />

          {/* Authentication routes */}
          <Stack.Screen name="(auths)" />

          {/* Tab navigation */}
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </Provider>
  );
}

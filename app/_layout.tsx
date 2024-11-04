// import { useFonts } from "expo-font";
// import { SplashScreen, Stack } from "expo-router";
// import { useEffect, useState } from "react";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { Provider, useDispatch } from "react-redux";
// import store, { AppDispatch } from "@/redux/store";
// import { View, Text } from "react-native";
// import FlashMessage from "react-native-flash-message";
// import { initializeAuth } from "@/redux/slices/authSlice";

// SplashScreen.preventAutoHideAsync();

// function AppInitializer() {
//   const dispatch = useDispatch<AppDispatch>();
//   const [fontsLoaded, setFontsLoaded] = useState(false);
//   const [authInitialized, setAuthInitialized] = useState(false);

//   const [loaded] = useFonts({
//     "Roboto-Mono": require("../assets/fonts/RobotoMono-Regular.ttf"),
//   });

//   useEffect(() => {
//     async function prepare() {
//       if (loaded) {
//         try {
//           await dispatch(initializeAuth()).unwrap();
//         } catch (error) {
//           console.error("Auth initialization failed:", error);
//         }
//         setFontsLoaded(true);
//         setAuthInitialized(true);
//         SplashScreen.hideAsync();
//       }
//     }
//     prepare();
//   }, [loaded, dispatch]);

//   if (!fontsLoaded || !authInitialized) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <>
//       <FlashMessage style={{ zIndex: 999 }} />
//       <Stack screenOptions={{ headerShown: false }}>
//         {/* The default route for index */}
//         <Stack.Screen name="index" />

//         {/* Authentication routes */}
//         <Stack.Screen name="(auths)" />

//         {/* Tab navigation */}
//         <Stack.Screen name="(tabs)" />
//       </Stack>
//     </>
//   );
// }

// export default function RootLayout() {
//   const [fontsLoaded, setFontsLoaded] = useState(false);

//   const [loaded] = useFonts({
//     "Roboto-Mono": require("../assets/fonts/RobotoMono-Regular.ttf"),
//   });

//   useEffect(() => {
//     if (loaded) {
//       setFontsLoaded(true);
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!fontsLoaded) {
//     return (
//       <View>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <Provider store={store}>
//       <SafeAreaProvider>
//         <AppInitializer />
//       </SafeAreaProvider>
//     </Provider>
//   );
// }

// app/_layout.tsx
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

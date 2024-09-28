// /app/_layout.tsx
import TimerProvider from "@/context/TimerContext";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Colors from "@/constants/Colors";
import CustomHeader from "@/components/CustomHeader";
import CustomDrawerContent from "@/components/CustomDrawerContent"; // Import your custom drawer content

const Drawer = createDrawerNavigator();
const NativeStack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Roboto-Mono": require("../assets/fonts/RobotoMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  function MyDrawer() {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          header: ({ route }) => {
            const routeName = route.name;
            const title =
              route.name === "home-screen"
                ? "Home"
                : route.name === "list-dish"
                ? "Menu"
                : route.name === "history-order"
                ? "Lịch sử đặt món"
                : route.name === "feedback"
                ? "Đánh giá"
                : route.name === "setting"
                ? "Cài đặt"
                : "Lịch sử đặt món"; // Fallback title if route doesn't match
            return <CustomHeader title={title} />;
          },
          drawerActiveTintColor: Colors.primary,
        }}
      >
        <Drawer.Screen
          name="home-screen"
          component={require("./(tabs)/home-screen").default}
          options={{
            drawerLabel: "HOME",
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="flower-tulip"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="list-dish"
          component={require("./(tabs)/list-dish").default}
          options={{
            drawerLabel: "MENU",
            drawerIcon: ({ color }) => (
              <Entypo name="open-book" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="history-order"
          component={require("./(tabs)/history-order").default}
          options={{
            drawerLabel: "LỊCH SỬ ĐẶT MÓN",
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="history" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="feedback"
          component={require("./(tabs)/feedback").default}
          options={{
            drawerLabel: "ĐÁNH GIÁ",
            drawerIcon: ({ color }) => (
              <Entypo name="star" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="setting"
          component={require("./(tabs)/setting").default}
          options={{
            drawerLabel: "CÀI ĐẶT",
            drawerIcon: ({ color }) => (
              <Entypo name="cog" size={24} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    );
  }

  return (
    <SafeAreaProvider>
      <TimerProvider>
        <NativeStack.Navigator>
          <NativeStack.Screen
            name="index"
            component={require("./index").default}
            options={{ headerShown: false }}
          />
          <NativeStack.Screen
            name="(tabs)"
            component={MyDrawer}
            options={{ headerShown: false }}
          />
          <NativeStack.Screen
            name="meditate/[id]"
            component={require("./meditate/[id]").default}
            options={{ headerShown: false }}
          />
          <NativeStack.Screen
            name="(modal)/adjust-meditation-duration"
            component={require("./(modal)/adjust-meditation-duration").default}
            options={{ headerShown: false, presentation: "modal" }}
          />
        </NativeStack.Navigator>
      </TimerProvider>
    </SafeAreaProvider>
  );
}

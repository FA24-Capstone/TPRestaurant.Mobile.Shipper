import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import AppGradient from "@/components/AppGradient";
import beachImage from "../assets/bg/StartScreen.jpg";
import { NativeWindStyleSheet } from "nativewind";
import * as Notifications from "expo-notifications";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
NativeWindStyleSheet.setOutput({
  default: "native",
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const router = useRouter();
  const { width, height } = Dimensions.get("window");

  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     getToken();
  //   }
  // }
  // const getToken = async () => {
  //   const token = await messaging().getToken();
  //   if (token) {
  //     await AsyncStorage.setItem("device_token", token);
  //     console.log("Your Firebase Token is:", token);
  //   }
  // };

  // useEffect(() => {
  //   requestUserPermission();
  // }, []);
  // messaging().setBackgroundMessageHandler(async (message) => {
  //   console.log(message);
  // });
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ImageBackground
        source={beachImage}
        resizeMode="cover"
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
        <AppGradient colors={["#ffffff00", "#ffffff00"]}>
          <SafeAreaView className="flex flex-1 px-1 justify-between">
            <Animated.View
              entering={FadeInDown.delay(300)
                .mass(0.5)
                .stiffness(80)
                .springify(20)}
            />

            <Animated.View
              entering={FadeInDown.delay(300)
                .mass(0.5)
                .stiffness(80)
                .springify(20)}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                className={`bg-[#9A0E1D] mb-10 rounded-xl min-h-[62px] justify-center items-center`}
                onPress={() => router.push("/(auths)/login")}
              >
                <Text className={`text-white font-semibold text-xl uppercase`}>
                  ĐĂNG NHẬP
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <StatusBar style="light" />
          </SafeAreaView>
        </AppGradient>
      </ImageBackground>
    </View>
  );
};

export default App;

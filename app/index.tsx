import {
  View,
  Text,
  Image,
  ImageBackground,
  useWindowDimensions,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomButton from "@/components/CustomButton";
import AppGradient from "@/components/AppGradient";
import { useRouter } from "expo-router";
import Animated, {
  FadeInDown,
  FadeInUp,
  withSpring,
} from "react-native-reanimated";

import beachImage from "../assets/bg/StartScreen.jpg";
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const App = () => {
  const router = useRouter();

  const { width, height } = Dimensions.get("window");
  console.log(`Width: ${width}, Height: ${height}`);

  const isLandscape = width > height;

  console.log("isLandscape", isLandscape);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ImageBackground
        source={beachImage}
        resizeMode="cover"
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
        <AppGradient
          // Background Linear Gradient
          colors={["#ffffff00", "#ffffff00"]}
        >
          <SafeAreaView className="flex flex-1 px-1 justify-between">
            <Animated.View
              entering={FadeInDown.delay(300)
                .mass(0.5)
                .stiffness(80)
                .springify(20)}
            ></Animated.View>

            <Animated.View
              entering={FadeInDown.delay(300)
                .mass(0.5)
                .stiffness(80)
                .springify(20)}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                className={`bg-[#9A0E1D] mb-10 rounded-xl min-h-[62px] justify-center items-center `}
                onPress={() => router.push("/(auths)/login")}
              >
                <Text className={`text-white font-semibold text-xl uppercase`}>
                  ĐĂNG NHẬP{" "}
                </Text>
              </TouchableOpacity>
              {/* <CustomButton
                onPress={() => router.push("/(auths)/login")}
                title="ĐĂNG NHẬP"
              /> */}
            </Animated.View>

            <StatusBar style="light" />
          </SafeAreaView>
        </AppGradient>
      </ImageBackground>
    </View>
  );
};

export default App;

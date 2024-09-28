import {
  View,
  Text,
  Image,
  ImageBackground,
  useWindowDimensions,
  Dimensions,
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

import beachImage from "../assets/meditation-images/bg-restaurant.jpg";
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
          colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
        >
          <SafeAreaView className="flex flex-1 px-1 justify-between">
            <Animated.View
              entering={FadeInDown.delay(300)
                .mass(0.5)
                .stiffness(80)
                .springify(20)}
            >
              <Text className="text-center text-white font-bold text-4xl">
                Nhà Hàng LOGO Xin Kinh Chào Quý Khách!
              </Text>
              <Text className="text-center text-white font-regular text-2xl mt-3">
                Đến đây để thưởng thức những điều tuyệt vời nhất
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(300)
                .mass(0.5)
                .stiffness(80)
                .springify(20)}
            >
              <CustomButton
                onPress={() => router.push("/home-screen")}
                title="BẮT ĐẦU KHÁM PHÁ"
              />
            </Animated.View>

            <StatusBar style="light" />
          </SafeAreaView>
        </AppGradient>
      </ImageBackground>
    </View>
  );
};

export default App;

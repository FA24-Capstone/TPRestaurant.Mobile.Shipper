import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import messaging from "@react-native-firebase/messaging";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index: React.FC = () => {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (checkingAuth) return;

    if (isLoggedIn) {
      router.replace("/home-screen");
    } else {
      router.replace("/start-screen");
    }
  }, [isLoggedIn, router, checkingAuth]);

  // Giả định rằng trạng thái `checkingAuth` được set bởi `AppInitializer` trong RootLayout
  useEffect(() => {
    // Đặt thời gian chờ để mô phỏng quá trình kiểm tra xác thực
    const timer = setTimeout(() => {
      setCheckingAuth(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // QUAN LAMMMMMMMMMMMMMMMM ===================== START

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getToken();
    }
  }
  const getToken = async () => {
    const token = await messaging().getToken();
    if (token) {
      await AsyncStorage.setItem("device_token", token);
      return token;
    }
  };

  useEffect(() => {
    requestUserPermission();
  }, []);
  messaging().setBackgroundMessageHandler(async (message) => {
    console.log(message);
  });

  // QUAN LAMMMMMMMMMMMMMMMM ===================== END

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#A1011A" />
      </View>
    );
  }

  return null;
};

export default Index;

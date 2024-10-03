import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { showSuccessMessage } from "@/components/FlashMessageHelpers";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rightIcon, setRightIcon] = useState<"eye" | "eye-off">("eye");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const router = useRouter();

  const handlePasswordVisibility = () => {
    setRightIcon(rightIcon === "eye" ? "eye-off" : "eye");
    setPasswordVisibility(!passwordVisibility);
  };

  const handleLogin = async () => {
    showSuccessMessage("Đăng nhập thành công!");
    router.replace("/home-screen");
  };

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      className="bg-[#A1011A] pt-10"
    >
      <View className="flex w-full items-center h-full mx-auto my-auto bg-[#A1011A]">
        <View className="w-full h-full mx-auto my-auto p-6">
          {/* Back button */}
          <TouchableOpacity
            className=" p-2 rounded-full bg-white w-10"
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="#A1011A" />
          </TouchableOpacity>

          {/* Header text */}
          <View className="mt-20 mb-10">
            <Text className="text-3xl font-bold text-white">
              Chào mừng quay trở lại
            </Text>
            <Text className="text-base mt-4 text-white">
              Please input your information
            </Text>
          </View>

          {/* Phone input */}
          <View className="mb-8">
            <TextInput
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#ffffff"
              value={username}
              onChangeText={setUsername}
              className="border-[1px] border-[#FFFFFF] px-4 py-4 rounded-lg text-white text-lg bg-transparent"
            />
          </View>

          {/* Password input */}
          <View className="mb-4 relative">
            <TextInput
              placeholder="Mật khẩu"
              placeholderTextColor="#ffffff"
              secureTextEntry={passwordVisibility}
              value={password}
              onChangeText={setPassword}
              className="border-[1px] border-[#FFFFFF] px-4 py-4 rounded-lg text-white text-lg bg-transparent"
              style={{ paddingRight: 40 }}
            />
            <TouchableOpacity
              onPress={handlePasswordVisibility}
              className="absolute right-4 top-4"
            >
              <Feather name={rightIcon} size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Login button */}
          <TouchableOpacity
            className="bg-white py-4 rounded-lg mt-4"
            onPress={handleLogin}
          >
            <Text className="text-center text-[#A1011A] font-bold text-lg">
              ĐĂNG NHẬP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;

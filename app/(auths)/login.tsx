import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styled } from "nativewind";
import { sendOtp } from "@/api/loginApi";
import shipperImage from "../../assets/bg/imageShipper.jpg";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import LoadingOverlay from "@/components/LoadingOverlay";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  // const [rememberMe, setRememberMe] = useState<boolean>(false); // Thêm state rememberMe

  const router = useRouter();

  const dispatch: AppDispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  console.log("isLoggedIn", isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/home-screen");
    }
  }, [isLoggedIn, router]);

  // Handle sending OTP
  const handleSendOtp = async () => {
    if (!phoneNumber) {
      showErrorMessage("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);
      await sendOtp(phoneNumber);
      showSuccessMessage("OTP sent successfully.");

      // Navigate to OTP verification screen and pass the phone number and rememberMe
      router.push({
        pathname: "/OTP",
        params: { phoneNumber }, // Truyền rememberMe dưới dạng chuỗi
      });
    } catch (error) {
      showErrorMessage("Failed to send OTP. Please try again.");
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay visible={loading} />}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Sử dụng padding hoặc height tùy thuộc vào nền tảng
        enabled
      >
        <StyledView className="flex-1 bg-white justify-center px-4 relative">
          <Image
            source={shipperImage}
            resizeMode="cover"
            style={{ width: "100%", height: 340, marginBottom: 50 }}
          />
          <StyledView className="mb-4 items-center">
            <StyledText className="text-3xl font-bold text-[#A1011A] mb-2">
              Chào mừng quay trở lại
            </StyledText>
            <StyledText className="text-base text-gray-700">
              Please input your phone number
            </StyledText>
          </StyledView>

          <View className="flex-row items-center gap-2 mb-4">
            <Text className="font-semibold text-[#A1011A] text-2xl">+84</Text>
            <StyledView className="w-[80%]">
              <StyledTextInput
                placeholder="Nhập số điện thoại"
                placeholderTextColor="#A1011A"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                className="w-full px-4 py-3 border border-[#A1011A] rounded-lg text-[#A1011A] text-lg bg-transparent"
              />
            </StyledView>
          </View>

          <StyledTouchableOpacity
            className="w-full py-3 bg-[#A1011A] rounded-lg"
            style={{ marginBottom: 16 }}
            onPress={handleSendOtp}
          >
            <StyledText className="text-center text-white font-bold text-lg">
              GỬI OTP
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Login;

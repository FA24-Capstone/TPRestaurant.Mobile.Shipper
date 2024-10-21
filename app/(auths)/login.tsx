import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { styled } from "nativewind";
import { sendOtp } from "@/api/loginApi";
import shipperImage from "../../assets/bg/imageShipper.jpg";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import LoadingOverlay from "@/components/LoadingOverlay";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const router = useRouter();

  // Handle sending OTP
  const handleSendOtp = async () => {
    if (!phoneNumber) {
      showErrorMessage("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true); // Start loading
      await sendOtp(phoneNumber);
      showSuccessMessage("OTP sent successfully.");

      // Navigate to OTP verification screen and pass the phone number
      router.push({
        pathname: "/OTP",
        params: { phoneNumber },
      });
    } catch (error) {
      showErrorMessage("Failed to send OTP. Please try again.");
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      {loading && <LoadingOverlay visible={loading} />}
      {/* Loading overlay component */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledView className="flex-1 bg-white justify-center px-4 relative">
          <Image
            source={shipperImage}
            resizeMode="cover"
            style={{ width: "100%", height: 360, marginBottom: 50 }}
          />
          {/* Header text */}
          <StyledView className="mb-8 items-center">
            <StyledText className="text-3xl font-bold text-[#A1011A] mb-2">
              Chào mừng quay trở lại
            </StyledText>
            <StyledText className="text-base text-gray-700">
              Please input your phone number
            </StyledText>
          </StyledView>

          {/* Phone input */}
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

          {/* Fixed Login Button */}
          <StyledTouchableOpacity
            className="w-full py-4 bg-[#A1011A] rounded-lg absolute bottom-0 left-0"
            style={{ margin: 16 }}
            onPress={handleSendOtp}
            disabled={loading} // Disable button when loading
          >
            <StyledText className="text-center text-white font-bold text-lg">
              GỬI OTP
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </ScrollView>
    </>
  );
};

export default Login;

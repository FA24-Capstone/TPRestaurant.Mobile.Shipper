import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Button } from "react-native-paper";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { loginWithOtp, sendOtp } from "@/api/loginApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { login, setProfile } from "@/redux/slices/authSlice";
import { getAccountByUserId } from "@/api/profileApi";

// Styled components using NativeWind
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface RouteParams {
  phoneNumber: string;
}

const OTP: React.FC = () => {
  const route = useRoute();
  const router = useRouter();
  const dispatch = useDispatch();
  const { phoneNumber } = route.params as RouteParams;

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [isDisabled, setIsDisabled] = useState(true);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);

  useEffect(() => {
    // Start countdown on mount
    startCountdown();
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const startCountdown = () => {
    setCountdown(60);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1 && countdownRef.current) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChangeText = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    setIsDisabled(otp.some((digit) => digit === ""));
  }, [otp]);

  const handleVerify = async () => {
    try {
      setLoading(true);
      const otpCode = otp.join(""); // Join OTP array into a single string

      // Use the loginWithOtp function to verify OTP and login
      const loginData = await loginWithOtp(phoneNumber, otpCode);

      // Dispatching login action if needed
      dispatch(
        login({
          token: loginData.token,
          refreshToken: loginData.refreshToken || "",
          mainRole: "SHIPPER",
          account: loginData.account,
          deviceResponse: loginData.deviceResponse,
        })
      );

      // Optionally, fetch the user's profile after login and dispatch it
      const profileData = await getAccountByUserId(loginData.account.id);
      if (profileData.isSuccess) {
        dispatch(
          setProfile({
            ...profileData.result,
            address: profileData.result.address || "",
          })
        );
      }

      // Show success message
      showSuccessMessage("Login successful!");

      // Navigate to the home screen after successful login
      router.replace("/home-screen");
    } catch (error) {
      showErrorMessage("Invalid OTP. Please try again.");
      console.error("Error during OTP verification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    try {
      setLoadingResend(true);
      // Call the resend OTP function
      await sendOtp(phoneNumber);
      showSuccessMessage("OTP resent successfully.");
      startCountdown();
    } catch (error) {
      showErrorMessage("Failed to resend OTP.");
      console.error("Error resending OTP:", error);
    } finally {
      setLoadingResend(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay visible={loading} />}
      <SafeAreaView className="flex-1 bg-white px-4 justify-center">
        {/* Back Button */}
        <StyledTouchableOpacity
          className="absolute top-14 left-6 p-2 border-[#A1011A] border-2 rounded-full"
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#A1011A" />
        </StyledTouchableOpacity>
        <StyledView className="w-full items-center">
          <StyledView className="mb-6">
            <Image
              source={require("../../assets/icon/otp.jpg")}
              className="w-40 h-40"
            />
          </StyledView>

          <StyledText className="text-xl font-semibold text-gray-800 mb-4">
            OTP Verification
          </StyledText>

          <StyledText className="text-base text-gray-800 mb-4 text-center">
            Enter the OTP sent to{" "}
            <StyledText className="font-bold">+84 {phoneNumber}</StyledText>
          </StyledText>

          <StyledView className="flex-row justify-between w-full mb-6 px-10">
            {otp.map((digit, index) => (
              <StyledTextInput
                key={index}
                ref={(ref: TextInput | null) =>
                  (inputRefs.current[index] = ref)
                }
                className="border-b-2 border-gray-400 text-center text-lg w-12"
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </StyledView>

          <StyledTouchableOpacity
            className="mb-4"
            onPress={handleResend}
            disabled={loadingResend || countdown > 0}
          >
            <StyledText className="text-sm text-red-500">
              {countdown > 0
                ? `OTP expires in ${countdown}s`
                : "OTP expired. Resend OTP?"}
            </StyledText>
            {loadingResend && (
              <StyledText className="text-sm mt-2 text-blue-500">
                Resending OTP...
              </StyledText>
            )}
          </StyledTouchableOpacity>
        </StyledView>

        {/* Fixed "Verify OTP" Button */}
        <StyledTouchableOpacity
          className="w-full py-4 bg-[#A1011A] rounded-lg absolute bottom-0 left-0"
          style={{ margin: 16 }}
          onPress={handleVerify}
          disabled={isDisabled}
        >
          <StyledText className="text-center text-white font-bold text-lg">
            VERIFY OTP
          </StyledText>
        </StyledTouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default OTP;

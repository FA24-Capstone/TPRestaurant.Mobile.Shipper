import axios from "axios";
import { AppDispatch } from "@/redux/store";
import { login, logout, setProfile } from "@/redux/slices/authSlice";
import { getAccountByUserId } from "./profileApi";
import * as SecureStore from "expo-secure-store";
import secureStorage from "@/redux/secureStore";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { AppActionResult } from "@/app/types/app_action_result_type";
import { LoginResult } from "@/app/types/login_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

// Function to send OTP
export const sendOtp = async (
  phoneNumber: string
): Promise<AppActionResult> => {
  const response = await axios.post(`${API_URL}/api/account/send-otp`, null, {
    params: {
      phoneNumber,
      otp: 0, // Assuming this parameter is needed by your API; adjust if necessary
    },
  });

  return response.data;
};

// Function to login using OTP
// Hàm đăng nhập bằng OTP
export const loginWithOtp = async (
  phoneNumber: string,
  otpCode: string
): Promise<AppActionResult<LoginResult>> => {
  const response = await axios.post<AppActionResult<LoginResult>>(
    `${API_URL}/api/account/login`,
    {
      phoneNumber,
      otpCode,
    }
  );

  return response.data;
};

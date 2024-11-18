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
import apiClient from "./config";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

//=============== Send OTP ===============
export const sendOtp = async (
  phoneNumber: string
): Promise<AppActionResult> => {
  const response = await apiClient.post<AppActionResult>(
    `/api/account/send-otp`,
    null, // Không có body
    {
      params: { phoneNumber, otp: 0 }, // Thêm tham số query
    }
  );

  return response.data;
};

// Function to login using OTP
export const loginWithOtp = async (
  phoneNumber: string,
  otpCode: string
): Promise<AppActionResult<LoginResult>> => {
  const response = await apiClient.post<AppActionResult<LoginResult>>(
    `/api/account/login`,
    { phoneNumber, otpCode } // Body của request
  );

  return response.data;
};

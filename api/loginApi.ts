import axios from "axios";
import { AppDispatch } from "@/redux/store";
import { login, logout, setProfile } from "@/redux/slices/authSlice";
import { LoginResponse } from "@/app/types/login_type";
import { getAccountByUserId } from "./profileApi";
import * as SecureStore from "expo-secure-store";
import secureStorage from "@/redux/secureStore";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

// Function to send OTP
export const sendOtp = async (phoneNumber: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/api/account/send-otp`, null, {
      params: {
        phoneNumber,
        otp: 0, // Assuming this parameter is needed by your API; adjust if necessary
      },
    });

    const data = response.data;

    if (data.isSuccess) {
      showSuccessMessage("OTP sent successfully!");
      console.log("OTP sent:", data.result);
      return data.result.otpId;
    } else {
      const errorMessage = data.messages?.[0] || "Failed to send OTP.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while sending the OTP.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

// Function to login using OTP
export const loginWithOtp = async (
  phoneNumber: string,
  otpCode: string
  // rememberMe: boolean
): Promise<LoginResponse["result"]> => {
  try {
    // Login API call
    const response = await axios.post<LoginResponse>(
      `${API_URL}/api/account/login`,
      {
        phoneNumber,
        otpCode,
      }
    );

    const data = response.data;

    if (data.isSuccess) {
      showSuccessMessage("Logged in successfully!");

      const loginData = data.result;

      // Store data in SecureStore if needed
      // if (rememberMe) {
      //   await secureStorage.setItem("token", loginData.token);
      //   await secureStorage.setItem(
      //     "refreshToken",
      //     loginData.refreshToken || ""
      //   );
      //   await secureStorage.setItem("rememberMe", "true");
      // } else {
      //   await secureStorage.removeItem("token");
      //   await secureStorage.removeItem("refreshToken");
      //   await secureStorage.removeItem("rememberMe");
      // }

      return loginData;
    } else {
      const errorMessage = data.messages?.[0] || "Login failed.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while trying to log in.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

// Function to logout
export const logoutUser = async (dispatch: AppDispatch) => {
  try {
    // Dispatch logout action
    dispatch(logout());

    // Remove tokens from SecureStore
    await secureStorage.removeItem("token");
    await secureStorage.removeItem("refreshToken");
    await secureStorage.removeItem("rememberMe");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

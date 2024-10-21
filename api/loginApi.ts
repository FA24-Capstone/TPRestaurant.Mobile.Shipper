import axios from "axios";
import { AppDispatch } from "@/redux/store";
import { login, setProfile } from "@/redux/slices/authSlice";
import { LoginResponse } from "@/app/types/login_type";
import { getAccountByUserId } from "./profileApi";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

// Function to send OTP
export const sendOtp = async (phoneNumber: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/api/account/send-otp`, null, {
      params: {
        phoneNumber,
        otp: 0,
      },
    });
    console.log("OTP sent:", response.data.result);

    return response.data.result.otpId;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

// Function to login using OTP
export const loginWithOtp = async (
  phoneNumber: string,
  otpCode: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    // Login API call
    const response = await axios.post<LoginResponse>(
      `${API_URL}/api/account/login`,
      {
        phoneNumber,
        otpCode,
      }
    );

    const loginData = response.data.result;

    // Dispatch login action
    dispatch(
      login({
        token: loginData.token,
        refreshToken: loginData.refreshToken || "",
        mainRole: loginData.mainRole,
        account: loginData.account,
        deviceResponse: loginData.deviceResponse,
      })
    );

    // Fetch profile data
    const profileResponse = await getAccountByUserId(loginData.account.id);

    // Check if the profile response is successful
    if (profileResponse && profileResponse.isSuccess) {
      // Dispatch profile data to Redux
      dispatch(
        setProfile({
          ...profileResponse.result,
          address: profileResponse.result.address || "",
        })
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

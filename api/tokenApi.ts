import { AppActionResult } from "@/app/types/app_action_result_type";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getUserTokenByIp = async (
  token: string
): Promise<AppActionResult> => {
  try {
    const response = await axios.post<AppActionResult>(
      `${API_URL}/token/get-user-token-by-ip`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    // Check response condition before returning data
    if (data.isSuccess) {
      return data;
    } else {
      const errorMessage =
        data.messages?.[0] || "Failed to get user token by IP.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while fetching the user token by IP.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const enableNotification = async (
  token: string,
  deviceToken: string
): Promise<AppActionResult> => {
  try {
    console.log("deviceToken", deviceToken);
    console.log("token", token);

    const response = await axios.post<AppActionResult>(
      `${API_URL}/token/enable-notification?deviceToken=${deviceToken}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    // Check response condition before returning data
    if (data.isSuccess) {
      return data;
    } else {
      const errorMessage =
        data.messages?.[0] || "Failed to enable notification.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while enabling notification.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

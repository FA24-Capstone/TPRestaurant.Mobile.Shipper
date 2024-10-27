import { AppActionResult } from "@/app/types/app_action_result_type";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getUserTokenByIp = async (
  token: string
): Promise<AppActionResult> => {
  try {
    const response = await axios.post(
      `${API_URL}/token/get-user-token-by-ip`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const enableNotification = async (
  token: string,
  deviceToken: string
): Promise<AppActionResult> => {
  try {
    console.log("deviceToken", deviceToken);
    console.log("token", token);
    const response = await axios.post(
      `${API_URL}/token/enable-notification?deviceToken=${deviceToken}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

import { AppActionResult } from "@/app/types/app_action_result_type";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getUserTokenByIp = async (
  token: string
): Promise<AppActionResult<TokenData>> => {
  const response = await axios.post<AppActionResult<TokenData>>(
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
};

// ==================== enableNotification API ====================
export const enableNotification = async (
  token: string,
  deviceToken?: string
): Promise<AppActionResult> => {
  console.log("deviceToken", deviceToken);
  const response = await axios.post<AppActionResult>(
    `${API_URL}/token/enable-notification${
      deviceToken ? `?deviceToken=${deviceToken}` : ""
    }`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteToken = async (id: string): Promise<AppActionResult> => {
  const response = await axios.delete<AppActionResult>(
    `${API_URL}/token/delete-token?tokenId=${id}`
  );
  return response.data;
};

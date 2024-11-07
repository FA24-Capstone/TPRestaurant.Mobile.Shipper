// src/api/profileApi.ts

import axios from "axios";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import { AppActionResult } from "@/app/types/app_action_result_type";
import { AccountProfile } from "@/app/types/profile_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ==================== Get Account By User ID ====================
// Hàm lấy thông tin hồ sơ người dùng bằng User ID
export const getAccountByUserId = async (
  userId: string
): Promise<AppActionResult<AccountProfile>> => {
  const response = await axios.get<AppActionResult<AccountProfile>>(
    `${API_URL}/api/account/get-account-by-user-id/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

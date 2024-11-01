// src/api/profileApi.ts

import axios from "axios";
import { AccountByUserIdResponse } from "@/app/types/profile_type";
import { showErrorMessage } from "@/components/FlashMessageHelpers";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ==================== Get Account By User ID ====================
export const getAccountByUserId = async (
  userId: string
): Promise<AccountByUserIdResponse> => {
  try {
    const response = await axios.get<AccountByUserIdResponse>(
      `${API_URL}/api/account/get-account-by-user-id/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (data.isSuccess) {
      return data;
    } else {
      const errorMessage =
        data.messages?.[0] || "Failed to retrieve account details.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while fetching account details.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

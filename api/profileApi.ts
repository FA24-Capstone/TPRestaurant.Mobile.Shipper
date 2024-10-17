// src/api/profileApi.ts
import { AccountByUserIdResponse } from "@/app/types/profile_type";
import axios from "axios";

// Cấu hình URL API từ biến môi trường
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Hàm lấy tài khoản theo userId
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
    return response.data;
  } catch (error) {
    console.error("Failed to get account by user ID:", error);
    throw error;
  }
};

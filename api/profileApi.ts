// src/api/profileApi.ts

import axios from "axios";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import { AppActionResult } from "@/app/types/app_action_result_type";
import { AccountProfile } from "@/app/types/profile_type";
import apiClient from "./config";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ==================== Get Account By User ID ====================
// Hàm lấy thông tin hồ sơ người dùng bằng User ID
export const getAccountByUserId = async (
  userId: string
): Promise<AppActionResult<AccountProfile>> => {
  const response = await apiClient.get<AppActionResult<AccountProfile>>(
    `/api/account/get-account-by-user-id/${userId}`
  );

  return response.data;
};

// ==================== Update Account ====================
// Hàm cập nhật thông tin tài khoản người dùng
export const updateAccount = async (
  accountId: string,
  firstName: string,
  lastName: string,
  dob: string, // should be in ISO format (e.g., '2024-10-30T23:55:25.028Z')
  gender: boolean,
  image: string // assuming the image is optional and provided as a File object
): Promise<AppActionResult<null>> => {
  const formData = new FormData();
  formData.append("AccountId", accountId);
  formData.append("FirstName", firstName);
  formData.append("LastName", lastName);
  formData.append("DOB", dob);
  formData.append("Gender", gender.toString());
  if (image) {
    const filename = image.split("/").pop();
    const type = "image/jpeg"; // You can change this if needed
    formData.append("Image", {
      uri: image,
      name: filename,
      type: type,
    } as any);
  }

  console.log("dataUpload", {
    accountId,
    firstName,
    lastName,
    dob,
    image,
    gender,
  });

  const response = await apiClient.put<AppActionResult<null>>(
    `/api/account/update-account`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 10000, // Optional: set a timeout for the request
    }
  );

  return response.data;
};

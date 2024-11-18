// src/api/feeShipApi.ts
import { AppActionResult } from "@/app/types/app_action_result_type";
import { AccountByPhoneResult } from "@/app/types/fee_ship_type";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import axios from "axios";
import apiClient from "./config";

// Cấu hình URL API từ biến môi trường
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Function to get account by phone number
export const getAccountByPhoneNumber = async (
  phoneNumber: string
): Promise<AppActionResult<AccountByPhoneResult>> => {
  const response = await apiClient.get<AppActionResult<AccountByPhoneResult>>(
    `/api/account/get-account-by-phone-number`,
    {
      params: { phoneNumber },
    }
  );

  return response.data;
};

// Function to calculate delivery order fee
export const calculateDeliverOrderFee = async (
  customerInfoAddressId: string
): Promise<AppActionResult<number>> => {
  const response = await apiClient.post<AppActionResult<number>>(
    `/order/calculate-deliver-order`,
    null, // Không có body
    {
      params: { customerInfoAddressId }, // Tham số query
    }
  );

  return response.data;
};

// src/api/feeShipApi.ts
import { AppActionResult } from "@/app/types/app_action_result_type";
import { AccountByPhoneResult } from "@/app/types/fee_ship_type";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import axios from "axios";

// Cấu hình URL API từ biến môi trường
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Function to get account by phone number
export const getAccountByPhoneNumber = async (
  phoneNumber: string
): Promise<AppActionResult<AccountByPhoneResult>> => {
  const response = await axios.get<AppActionResult<AccountByPhoneResult>>(
    `${API_URL}/api/account/get-account-by-phone-number`,
    {
      params: { phoneNumber },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// Function to calculate delivery order fee
export const calculateDeliverOrderFee = async (
  customerInfoAddressId: string
): Promise<AppActionResult<number>> => {
  const response = await axios.post<AppActionResult<number>>(
    `${API_URL}/order/calculate-deliver-order`,
    null, // POST request với query parameters, không có body
    {
      params: { customerInfoAddressId },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

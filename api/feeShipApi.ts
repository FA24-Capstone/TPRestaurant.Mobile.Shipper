// src/api/feeShipApi.ts
import {
  AccountByPhoneReponse,
  FeeShipOrderResponse,
} from "@/app/types/fee_ship_type";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import axios from "axios";

// Cấu hình URL API từ biến môi trường
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Function to get account by phone number
export const getAccountByPhoneNumber = async (
  phoneNumber: string
): Promise<AccountByPhoneReponse> => {
  try {
    const response = await axios.get<AccountByPhoneReponse>(
      `${API_URL}/api/account/get-account-by-phone-number`,
      {
        params: { phoneNumber },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // Check response condition before returning data
    if (data.isSuccess) {
      return data;
    } else {
      const errorMessage = data.messages?.[0] || "Failed to retrieve account.";
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

// Function to calculate delivery order fee
export const calculateDeliverOrderFee = async (
  customerInfoAddressId: string
): Promise<FeeShipOrderResponse> => {
  try {
    const response = await axios.post<FeeShipOrderResponse>(
      `${API_URL}/order/calculate-deliver-order`,
      null, // POST request with query parameters, no body
      {
        params: { customerInfoAddressId },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // Check response condition before returning data
    if (data.isSuccess) {
      return data;
    } else {
      const errorMessage =
        data.messages?.[0] || "Failed to calculate delivery fee.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while calculating the delivery fee.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

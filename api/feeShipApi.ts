// src/api/feeShipApi.ts
import {
  AccountByPhoneReponse,
  FeeShipOrderResponse,
} from "@/app/types/fee_ship_type";
import axios from "axios";

// Cấu hình URL API từ biến môi trường
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Hàm lấy tài khoản theo số điện thoại
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
    return response.data;
  } catch (error) {
    console.error("Failed to get account by phone number:", error);
    throw error;
  }
};

// Hàm tính phí giao hàng dựa trên customerInfoAddressId
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
    return response.data;
  } catch (error) {
    console.error("Failed to calculate delivery order fee:", error);
    throw error;
  }
};

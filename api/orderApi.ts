// src/api/orderAPI.ts
import axios from "axios";
import {
  UpdateOrderStatusResponse,
  GetOrderMapResponse,
  GetOptimalPathRequest,
  GetOptimalPathResponse,
  GetAllOrdersByStatusParams,
  GetAllOrdersByStatusResponse,
  AssignOrderForShipperResponse,
  AssignOrderForShipperRequest,
  UploadConfirmedOrderImageRequest,
  UploadConfirmedOrderImageResponse,
  GetHistoryOrderIdReponse,
} from "@/app/types/order_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ==================== Update Order Status ====================
export const updateOrderStatus = async (
  orderId: string,
  isSuccessful: boolean
): Promise<UpdateOrderStatusResponse> => {
  try {
    const response = await axios.put<UpdateOrderStatusResponse>(
      `${API_URL}/order/update-order-status/${orderId}`,
      null, // PUT request with query parameters, no body
      {
        params: { isSuccessful },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw error;
  }
};

// ==================== Get Order Map ====================
export const getOrderMap = async (
  orderId: string
): Promise<GetOrderMapResponse> => {
  try {
    const response = await axios.get<GetOrderMapResponse>(
      `${API_URL}/map/get-order-map`,
      {
        params: { orderId },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get order map:", error);
    throw error;
  }
};

// ==================== Get Optimal Path ====================
export const getOptimalPath = async (
  orderIds: GetOptimalPathRequest
): Promise<GetOptimalPathResponse> => {
  try {
    const response = await axios.post<GetOptimalPathResponse>(
      `${API_URL}/map/get-optimal-path`,
      orderIds,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get optimal path:", error);
    throw error;
  }
};

// ==================== Get All Orders By Status ====================
export const getAllOrdersByStatus = async (
  params: GetAllOrdersByStatusParams
): Promise<GetAllOrdersByStatusResponse> => {
  try {
    console.log("getAllOrdersByStatus params:", params);

    const response = await axios.get<GetAllOrdersByStatusResponse>(
      `${API_URL}/order/get-all-order-by-Status/${params.pageNumber}/${params.pageSize}`,
      {
        params: {
          status: params.status,
          orderType: params.orderType,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("API response for getAllOrdersByStatus:", response.data);

    return response.data;
  } catch (error) {
    console.error("Failed to get all orders by status:", error);
    throw error;
  }
};

// ==================== Assign Orders to Shipper ====================
export const assignOrdersForShipper = async (
  shipperId: string,
  orderIds: AssignOrderForShipperRequest
): Promise<AssignOrderForShipperResponse> => {
  try {
    const response = await axios.post<AssignOrderForShipperResponse>(
      `${API_URL}/order/assign-order-for-shipper`,
      orderIds,
      {
        params: { shipperId },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to assign orders for shipper:", error);
    throw error;
  }
};

// ==================== Upload Confirmed Order Image ====================
export const uploadConfirmedOrderImage = async (
  data: UploadConfirmedOrderImageRequest
): Promise<UploadConfirmedOrderImageResponse> => {
  const formData = new FormData();
  formData.append("OrderId", data.orderId);
  formData.append("Image", data.image);

  try {
    const response = await axios.post<UploadConfirmedOrderImageResponse>(
      `${API_URL}/order/upload-confirmed-order-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to upload confirmed order image:", error);
    throw error;
  }
};

export const getOrderId = async (
  orderId: string
): Promise<GetHistoryOrderIdReponse> => {
  // console.log("orderIdNe", orderId);

  try {
    const response = await axios.get<GetHistoryOrderIdReponse>(
      `${API_URL}/order/get-order-detail/${orderId}`,
      { headers: { "Content-Type": "application/json" } }
    );
    // Log detailed response for debugging
    console.log(
      "API response for getHistoryOrderId:",
      JSON.stringify(response.data.result, null, 2)
    );
    // Return the entire response data to match the expected shape
    return response.data;
  } catch (error) {
    // Log and rethrow the error to handle it in the caller function or middleware
    console.error("Failed to getHistoryOrderId:", error);
    throw error;
  }
};

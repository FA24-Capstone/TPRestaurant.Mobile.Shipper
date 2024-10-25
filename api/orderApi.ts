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
  UpdateDeliveringStatusResponse,
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
export const getAllOrdersByShipper = async (
  params: GetAllOrdersByStatusParams
): Promise<GetAllOrdersByStatusResponse> => {
  try {
    console.log("getAllOrdersByShipper params:", params);

    // Tạo một đối tượng params linh hoạt
    const queryParams: any = {
      shipperId: params.shipperId,
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
    };

    // Chỉ thêm status nếu có
    if (params.status) {
      queryParams.status = params.status;
    }

    const response = await axios.get<GetAllOrdersByStatusResponse>(
      `${API_URL}/order/get-all-order-by-shipper-id/${params.shipperId}/${params.pageNumber}/${params.pageSize}`,
      {
        params: queryParams,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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

  const filename = data.image.split("/").pop();
  const type = "image/jpeg"; // Bạn có thể thay đổi nếu cần thiết
  formData.append("Image", {
    uri: data.image,
    name: filename,
    type: type,
  } as any);

  console.log("dataUpload", {
    orderId: data.orderId,
    image: data.image,
  });

  try {
    const response = await axios.post<UploadConfirmedOrderImageResponse>(
      `${API_URL}/order/upload-confirmed-order-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // "Authorization": `Bearer ${token}`, // Include if required
        },
        timeout: 10000, // Optional: set a timeout for the request
      }
    );
    console.log("API response for uploadConfirmedOrderImage:", response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to upload image."
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred.");
    }
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
    // console.log(
    //   "API response for getHistoryOrderId:",
    //   JSON.stringify(response.data.result, null, 2)
    // );
    // Return the entire response data to match the expected shape
    return response.data;
  } catch (error) {
    // Log and rethrow the error to handle it in the caller function or middleware
    console.error("Failed to getHistoryOrderId:", error);
    throw error;
  }
};

// ==================== Update Order Detail Status ====================
export const updateOrderDetailStatus = async (
  orderId: string, // Expecting an array of order IDs
  isSuccessful: boolean
): Promise<UpdateOrderStatusResponse> => {
  try {
    const response = await axios.put<UpdateOrderStatusResponse>(
      `${API_URL}/order/update-order-status/${orderId}`,
      orderId, // Send the orderIds array in the body
      {
        params: { isSuccessful }, // Pass the isSuccessful as a query parameter
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update order detail status:", error);
    throw error;
  }
};

// ==================== Update Delivering Status ====================
export const updateDeliveringStatus = async (
  shipperId: string,
  isDelivering: boolean
): Promise<UpdateDeliveringStatusResponse> => {
  try {
    const response = await axios.put<UpdateDeliveringStatusResponse>(
      `${API_URL}/api/account/update-delivering-status/${shipperId}`,
      null, // PUT request không có body
      {
        params: { isDelivering },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update delivering status:", error);
    throw error;
  }
};

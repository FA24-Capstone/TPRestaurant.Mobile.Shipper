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
  CancelDeliveringOrderResponse,
} from "@/app/types/order_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

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

    const data = response.data;

    if (data.isSuccess) {
      showSuccessMessage("Order status updated successfully!");
      return data;
    } else {
      const errorMessage = data.messages?.[0] || "Unknown error occurred.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while updating the order status.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
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

    const data = response.data;

    if (data.isSuccess) {
      return data;
    } else {
      const errorMessage =
        data.messages?.[0] || "Failed to retrieve order map.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while fetching the order map.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
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

    const data = response.data;

    if (data.isSuccess) {
      return data;
    } else {
      const errorMessage =
        data.messages?.[0] || "Failed to retrieve optimal path.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while fetching the optimal path.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

// ==================== Get All Orders By Status ====================
export const getAllOrdersByShipper = async (
  params: GetAllOrdersByStatusParams
): Promise<GetAllOrdersByStatusResponse> => {
  try {
    console.log("getAllOrdersByShipper params:", params);

    // Create a flexible params object
    const queryParams: any = {
      shipperId: params.shipperId,
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
    };

    // Only add status if it exists
    if (params.status !== undefined && params.status !== null) {
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

    const data = response.data;

    if (data.isSuccess) {
      return data;
    } else {
      const errorMessage = data.messages?.[0] || "Failed to retrieve orders.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while fetching the orders.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
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
      { orderIds }, // Ensure the body structure matches the backend expectation
      {
        params: { shipperId },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (data.isSuccess) {
      showSuccessMessage("Orders assigned to shipper successfully!");
      return data;
    } else {
      const errorMessage = data.messages?.[0] || "Failed to assign orders.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while assigning the orders.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

// ==================== Upload Confirmed Order Image ====================
export const uploadConfirmedOrderImage = async (
  data: UploadConfirmedOrderImageRequest
): Promise<UploadConfirmedOrderImageResponse> => {
  const formData = new FormData();
  formData.append("OrderId", data.orderId);

  const filename = data.image.split("/").pop();
  const type = "image/jpeg"; // You can change this if needed
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

    const dataResponse = response.data;

    if (dataResponse.isSuccess) {
      showSuccessMessage("Image uploaded successfully!");
      return dataResponse;
    } else {
      const errorMessage =
        dataResponse.messages?.[0] || "Failed to upload image.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while uploading the image.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

// ==================== Get Order Detail by ID ====================
export const getOrderId = async (
  orderId: string
): Promise<GetHistoryOrderIdReponse> => {
  try {
    const response = await axios.get<GetHistoryOrderIdReponse>(
      `${API_URL}/order/get-order-detail/${orderId}`,
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data;

    if (data.isSuccess) {
      return data;
    } else {
      const errorMessage =
        data.messages?.[0] || "Failed to retrieve order details.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while fetching the order details.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

// ==================== Update Order Detail Status ====================
export const updateOrderDetailStatus = async (
  orderId: string, // Expecting a single order ID
  isSuccessful: boolean
): Promise<UpdateOrderStatusResponse> => {
  try {
    const response = await axios.put<UpdateOrderStatusResponse>(
      `${API_URL}/order/update-order-status/${orderId}`,
      null, // Assuming no body is needed; adjust if necessary
      {
        params: { isSuccessful },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (data.isSuccess) {
      showSuccessMessage("Order detail status updated successfully!");
      return data;
    } else {
      const errorMessage =
        data.messages?.[0] || "Failed to update order detail status.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while updating the order detail status.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
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
      null, // PUT request with no body
      {
        params: { isDelivering },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (data.isSuccess) {
      showSuccessMessage("Delivering status updated successfully!");
      return data;
    } else {
      const errorMessage =
        data.messages?.[0] || "Failed to update delivering status.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while updating the delivering status.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

// ==================== Cancel Delivering Order ====================
export const cancelDeliveringOrder = async (
  orderId: string,
  cancelledReasons: string,
  shipperRequestId: string,
  isCancelledByAdmin: boolean
): Promise<CancelDeliveringOrderResponse> => {
  try {
    const response = await axios.post<CancelDeliveringOrderResponse>(
      `${API_URL}/order/cancel-delivering-order`,
      {
        orderId,
        cancelledReasons,
        shipperRequestId,
        isCancelledByAdmin,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (data.isSuccess) {
      showSuccessMessage("Order cancellation processed successfully!");
      return data;
    } else {
      const errorMessage = data.messages?.[0] || "Failed to cancel the order.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while processing the order cancellation.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

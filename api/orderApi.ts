// src/api/orderAPI.ts
import axios from "axios";
import {
  GetOptimalPathRequest,
  GetAllOrdersByStatusParams,
  AssignOrderForShipperRequest,
  UploadConfirmedOrderImageRequest,
  GetAllOrdersData,
  OptimalPathResult,
  OrderHistoryData,
} from "@/app/types/order_type";
import { AppActionResult } from "@/app/types/app_action_result_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getOrderMap = async (
  orderId: string
): Promise<AppActionResult<string>> => {
  const response = await axios.get<AppActionResult<string>>(
    `${API_URL}/map/get-order-map`,
    {
      params: { orderId },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// ==================== Get Optimal Path ====================

export const getOptimalPath = async (
  orderIds: GetOptimalPathRequest
): Promise<AppActionResult<OptimalPathResult[]>> => {
  const response = await axios.post<AppActionResult<OptimalPathResult[]>>(
    `${API_URL}/map/get-optimal-path`,
    orderIds,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// ==================== Get All Orders By Status ====================

export const getAllOrdersByShipper = async (
  params: GetAllOrdersByStatusParams
): Promise<AppActionResult<GetAllOrdersData>> => {
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

  const response = await axios.get<AppActionResult<GetAllOrdersData>>(
    `${API_URL}/order/get-all-order-by-shipper-id/${params.shipperId}/${params.pageNumber}/${params.pageSize}`,
    {
      params: queryParams,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("getAllOrdersByShipper response:", response.data);

  return response.data;
};

// ==================== Assign Orders to Shipper ====================
export const assignOrdersForShipper = async (
  shipperId: string,
  orderIds: AssignOrderForShipperRequest
): Promise<AppActionResult<string>> => {
  const response = await axios.post<AppActionResult<string>>(
    `${API_URL}/order/assign-order-for-shipper`,
    { orderIds }, // Ensure the body structure matches the backend expectation
    {
      params: { shipperId },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// ==================== Upload Confirmed Order Image ====================

export const uploadConfirmedOrderImage = async (
  data: UploadConfirmedOrderImageRequest
): Promise<AppActionResult<string>> => {
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

  const response = await axios.post<AppActionResult<string>>(
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

  return response.data;
};

// ==================== Get Order Detail by ID ====================
export const getOrderId = async (
  orderId: string
): Promise<AppActionResult<OrderHistoryData>> => {
  const response = await axios.get<AppActionResult<OrderHistoryData>>(
    `${API_URL}/order/get-order-detail/${orderId}`,
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data;
};

// ==================== Update Order Detail Status ====================
// export const updateOrderDetailStatus = async (
//   orderId: string, // Expecting a single order ID
//   isSuccessful: boolean
// ): Promise<UpdateOrderStatusResponse> => {
//   try {
//     const response = await axios.put<UpdateOrderStatusResponse>(
//       `${API_URL}/order/update-order-status/${orderId}`,
//       null, // Assuming no body is needed; adjust if necessary
//       {
//         params: { isSuccessful },
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const data = response.data;

//     if (data.isSuccess) {
//       showSuccessMessage("Order detail status updated successfully!");
//       return data;
//     } else {
//       const errorMessage =
//         data.messages?.[0] || "Failed to update order detail status.";
//       showErrorMessage(errorMessage);
//       throw new Error(errorMessage);
//     }
//   } catch (error: any) {
//     if (axios.isAxiosError(error)) {
//       const backendMessage =
//         error.response?.data?.messages?.[0] ||
//         "An error occurred while updating the order detail status.";
//       showErrorMessage(backendMessage);
//       throw new Error(backendMessage);
//     } else {
//       showErrorMessage("An unexpected error occurred.");
//       throw new Error("An unexpected error occurred.");
//     }
//   }
// };

export const updateOrderDetailStatus = async (
  orderId: string, // Expecting a single order ID
  isSuccessful: boolean
): Promise<AppActionResult<string>> => {
  const response = await axios.put<AppActionResult<string>>(
    `${API_URL}/order/update-order-status/${orderId}`,
    null, // Assuming no body is needed; adjust if necessary
    {
      params: { isSuccessful },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// ==================== Update Delivering Status ====================
// export const updateDeliveringStatus = async (
//   shipperId: string,
//   isDelivering: boolean
// ): Promise<UpdateDeliveringStatusResponse> => {
//   try {
//     const response = await axios.put<UpdateDeliveringStatusResponse>(
//       `${API_URL}/api/account/update-delivering-status/${shipperId}`,
//       null, // PUT request with no body
//       {
//         params: { isDelivering },
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const data = response.data;

//     if (data.isSuccess) {
//       showSuccessMessage("Delivering status updated successfully!");
//       return data;
//     } else {
//       const errorMessage =
//         data.messages?.[0] || "Failed to update delivering status.";
//       showErrorMessage(errorMessage);
//       throw new Error(errorMessage);
//     }
//   } catch (error: any) {
//     if (axios.isAxiosError(error)) {
//       const backendMessage =
//         error.response?.data?.messages?.[0] ||
//         "An error occurred while updating the delivering status.";
//       showErrorMessage(backendMessage);
//       throw new Error(backendMessage);
//     } else {
//       showErrorMessage("An unexpected error occurred.");
//       throw new Error("An unexpected error occurred.");
//     }
//   }
// };

export const updateDeliveringStatus = async (
  shipperId: string,
  isDelivering: boolean
): Promise<AppActionResult<any | null>> => {
  const response = await axios.put<AppActionResult<any | null>>(
    `${API_URL}/api/account/update-delivering-status/${shipperId}`,
    null, // PUT request with no body
    {
      params: { isDelivering },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// ==================== Cancel Delivering Order ====================
// export const cancelDeliveringOrder = async (
//   orderId: string,
//   cancelledReasons: string,
//   shipperRequestId: string,
//   isCancelledByAdmin: boolean
// ): Promise<CancelDeliveringOrderResponse> => {
//   try {
//     const response = await axios.post<CancelDeliveringOrderResponse>(
//       `${API_URL}/order/cancel-delivering-order`,
//       {
//         orderId,
//         cancelledReasons,
//         shipperRequestId,
//         isCancelledByAdmin,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const data = response.data;

//     if (data.isSuccess) {
//       showSuccessMessage("Order cancellation processed successfully!");
//       return data;
//     } else {
//       const errorMessage = data.messages?.[0] || "Failed to cancel the order.";
//       showErrorMessage(errorMessage);
//       throw new Error(errorMessage);
//     }
//   } catch (error: any) {
//     if (axios.isAxiosError(error)) {
//       const backendMessage =
//         error.response?.data?.messages?.[0] ||
//         "An error occurred while processing the order cancellation.";
//       showErrorMessage(backendMessage);
//       throw new Error(backendMessage);
//     } else {
//       showErrorMessage("An unexpected error occurred.");
//       throw new Error("An unexpected error occurred.");
//     }
//   }
// };

export const cancelDeliveringOrder = async (
  orderId: string,
  cancelledReasons: string,
  shipperRequestId: string,
  isCancelledByAdmin: boolean
): Promise<AppActionResult<any | null>> => {
  const response = await axios.post<AppActionResult<any | null>>(
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

  return response.data;
};

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
import apiClient from "./config";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getOrderMap = async (
  orderId: string
): Promise<AppActionResult<string>> => {
  const response = await apiClient.get<AppActionResult<string>>(
    `/map/get-order-map`,
    {
      params: { orderId },
    }
  );

  return response.data;
};

// ==================== Get Optimal Path ====================

export const getOptimalPath = async (
  orderIds: GetOptimalPathRequest
): Promise<AppActionResult<OptimalPathResult[]>> => {
  const response = await apiClient.post<AppActionResult<OptimalPathResult[]>>(
    `/map/get-optimal-path`,
    orderIds
  );

  return response.data;
};

// ==================== Get All Orders By Status ====================

export const getAllOrdersByShipper = async (
  params: GetAllOrdersByStatusParams
): Promise<AppActionResult<GetAllOrdersData>> => {
  console.log("getAllOrdersByShipper params:", params);

  const queryParams: any = {
    shipperId: params.shipperId,
    pageNumber: params.pageNumber,
    pageSize: params.pageSize,
  };

  if (params.status !== undefined && params.status !== null) {
    queryParams.status = params.status;
  }

  const response = await apiClient.get<AppActionResult<GetAllOrdersData>>(
    `/order/get-all-order-by-shipper-id/${params.shipperId}/${params.pageNumber}/${params.pageSize}`,
    {
      params: queryParams,
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
  const response = await apiClient.post<AppActionResult<string>>(
    `/order/assign-order-for-shipper`,
    { orderIds },
    {
      params: { shipperId },
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

  const response = await apiClient.post<AppActionResult<string>>(
    `/order/upload-confirmed-order-image`,
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

// ==================== Get Order Detail by ID ====================
export const getOrderId = async (
  orderId: string
): Promise<AppActionResult<OrderHistoryData>> => {
  const response = await apiClient.get<AppActionResult<OrderHistoryData>>(
    `/order/get-order-detail/${orderId}`
  );

  return response.data;
};

// ==================== Update Order Detail Status ====================

export const updateOrderDetailStatus = async (
  orderId: string,
  isSuccessful: boolean,
  status: number, // Status là optional
  asCustomer: boolean = false // Default asCustomer là false
): Promise<AppActionResult<string>> => {
  const response = await apiClient.put<AppActionResult<string>>(
    `/order/update-order-status/${orderId}`,
    null,
    {
      params: {
        isSuccessful,
        status,
        asCustomer,
      },
    }
  );

  return response.data;
};

// ==================== Update Delivering Status ====================

export const updateDeliveringStatus = async (
  shipperId: string,
  isDelivering: boolean
): Promise<AppActionResult<any | null>> => {
  const response = await apiClient.put<AppActionResult<any | null>>(
    `/api/account/update-delivering-status/${shipperId}`,
    null,
    {
      params: { isDelivering },
    }
  );

  return response.data;
};

// ==================== Cancel Delivering Order ====================

export const cancelDeliveringOrder = async (
  orderId: string,
  cancelledReasons: string,
  shipperRequestId: string,
  isCancelledByAdmin: boolean
): Promise<AppActionResult<any | null>> => {
  const response = await apiClient.post<AppActionResult<any | null>>(
    `/order/cancel-delivering-order`,
    {
      orderId,
      cancelledReasons,
      shipperRequestId,
      isCancelledByAdmin,
    }
  );

  return response.data;
};

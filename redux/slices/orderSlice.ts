// src/redux/slices/orderSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Order } from "@/app/types/order_type";
import { getAllOrdersByShipper } from "@/api/orderApi";
import {
  GetAllOrdersByStatusParams,
  GetAllOrdersByStatusResponse,
} from "@/app/types/order_type";

// Định nghĩa interface cho state
interface OrdersState {
  ordersByStatus: {
    pending: Order[];
    delivering: Order[];
    delivered: Order[];
    cancelled: Order[];
  };
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: OrdersState = {
  ordersByStatus: {
    pending: [],
    delivering: [],
    delivered: [],
    cancelled: [],
  },
  loading: false,
  error: null,
};

// Tạo async thunk để fetch orders theo status
export const fetchOrdersByStatus = createAsyncThunk<
  { statusKey: keyof OrdersState["ordersByStatus"]; orders: Order[] },
  GetAllOrdersByStatusParams,
  { rejectValue: string }
>("orders/fetchOrdersByStatus", async (params, { rejectWithValue }) => {
  try {
    const response: GetAllOrdersByStatusResponse = await getAllOrdersByShipper(
      params
    );
    if (!response.isSuccess) {
      return rejectWithValue(
        response.messages?.[0] || "Failed to fetch orders."
      );
    }
    // Chuyển đổi status number thành key string nếu cần thiết
    if (params.status === undefined) {
      return rejectWithValue("Status is undefined.");
    }
    const statusKey = getStatusKey(params.status);
    return { statusKey, orders: response.result.items };
  } catch (error: any) {
    return rejectWithValue(
      error.message || "An error occurred while fetching orders."
    );
  }
});

// Hàm chuyển đổi status number thành key string
const getStatusKey = (status: number): keyof OrdersState["ordersByStatus"] => {
  switch (status) {
    case 7:
      return "pending";
    case 8:
      return "delivering";
    case 9:
      return "delivered";
    case 10:
      return "cancelled";
    default:
      return "pending"; // Default hoặc throw error nếu status không hợp lệ
  }
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrdersByStatus(
      state,
      action: PayloadAction<{
        statusKey: keyof OrdersState["ordersByStatus"];
        orders: Order[];
      }>
    ) {
      state.ordersByStatus[action.payload.statusKey] = action.payload.orders;
    },
    resetOrders(state) {
      state.ordersByStatus = initialState.ordersByStatus;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersByStatus[action.payload.statusKey] = action.payload.orders;
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch orders.";
      });
  },
});

export const { setOrdersByStatus, resetOrders } = orderSlice.actions;
export default orderSlice.reducer;

// src/redux/slices/notificationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getNotificationsByUserId,
  markAllNotificationsAsRead,
} from "@/api/notificationApi";
import {
  NotificationDataReponse,
  NotificationItem,
} from "@/app/types/notification_type";
import { AppActionResult } from "@/app/types/app_action_result_type";

interface NotificationState {
  notifications: NotificationItem[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk<
  NotificationItem[],
  string,
  { rejectValue: string }
>(
  "notifications/fetchNotifications",
  async (accountId, { rejectWithValue }) => {
    try {
      const response: AppActionResult<{ items: NotificationItem[] }> =
        await getNotificationsByUserId(accountId);

      if (!response.isSuccess) {
        return rejectWithValue(
          response.messages?.[0] || "Failed to fetch notifications."
        );
      }

      return response.result.items;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while fetching notifications."
      );
    }
  }
);

export const markAllNotifications = createAsyncThunk<
  AppActionResult<NotificationDataReponse>, // API trả về AppActionResult
  string, // Tham số truyền vào là accountId (string)
  { rejectValue: string } // Lỗi trả về dạng string
>("notifications/markAllAsRead", async (accountId, { rejectWithValue }) => {
  try {
    const response = await markAllNotificationsAsRead(accountId);

    if (!response.isSuccess) {
      return rejectWithValue(
        response.messages?.[0] || "Failed to mark all notifications as read."
      );
    }

    return response; // Trả về toàn bộ response để xử lý sau
  } catch (error: any) {
    return rejectWithValue(
      error.message ||
        "An error occurred while marking all notifications as read."
    );
  }
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotifications(state) {
      state.notifications = [];
      state.error = null;
    },
    markNotificationReadInStore(state, action: PayloadAction<string>) {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (n) => n.notificationId === notificationId
      );
      if (notification) {
        notification.isRead = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNotifications.fulfilled,
        (state, action: PayloadAction<NotificationItem[]>) => {
          state.notifications = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notifications.";
      })
      .addCase(markAllNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAllNotifications.fulfilled, (state, action) => {
        // Cập nhật trạng thái khi thành công
        if (action.payload.isSuccess) {
          state.notifications = state.notifications.map((notification) => ({
            ...notification,
            isRead: true,
          }));
        }
        state.loading = false;
      })
      .addCase(markAllNotifications.rejected, (state, action) => {
        // Cập nhật lỗi nếu có
        state.loading = false;
        state.error =
          action.payload || "Failed to mark all notifications as read.";
      });
  },
});

export const { resetNotifications, markNotificationReadInStore } =
  notificationSlice.actions;
export default notificationSlice.reducer;

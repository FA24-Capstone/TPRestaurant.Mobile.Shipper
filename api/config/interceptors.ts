// src/api/config/interceptors.ts
import apiClient from "./config";
import * as SecureStore from "expo-secure-store";
import { logout } from "../../redux/slices/authSlice";
import { router } from "expo-router";
import { showSuccessMessage } from "@/components/FlashMessageHelpers";

export const setupInterceptors = (store: any) => {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const statusCode = error.response?.status;

      if (statusCode === 401 || statusCode === 403) {
        console.error(
          `${statusCode} Unauthorized or Forbidden - Logging out...`
        );

        // Xóa SecureStore
        await SecureStore.deleteItemAsync("token");

        // Dispatch hành động logout từ Redux
        store.dispatch(logout());
        // Điều hướng về màn hình đăng nhập
        router.replace("/login");
        showSuccessMessage("Đăng xuất thành công!");
      }

      return Promise.reject(error);
    }
  );
};

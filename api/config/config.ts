// // src/api/config.ts

import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

if (!API_URL) {
  throw new Error("API_URL is not defined. Check your .env file.");
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Hàm để lấy token từ SecureStore
const getToken = async () => {
  return await SecureStore.getItemAsync("token");
};

// Interceptor để thêm token vào headers
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    console.log("Token:", token);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

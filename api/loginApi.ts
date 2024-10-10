import { LoginResponse } from "@/app/types/login_type";
import { login } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

// Create the login function
export const loginDevice = async (
  deviceCode: string,
  password: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    // console.log("requestLOGIN", deviceCode, password);
    // console.log("APIlink", `${API_URL}/device/login-device`);
    const response = await axios.post<LoginResponse>(
      `${API_URL}/device/login-device`,
      {
        deviceCode,
        password,
      }
    );
    // console.log("responseLOGIN", response);

    const { token, deviceResponse } = response.data.result;

    // Dispatch to Redux store
    dispatch(
      login({
        token,
        deviceResponse: {
          deviceId: deviceResponse.deviceId,
          deviceCode: deviceResponse.deviceCode,
          tableId: deviceResponse.tableId,
          tableName: deviceResponse.tableName,
          mainRole: deviceResponse.mainRole,
        },
      })
    );
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

import { Account } from "@/app/types/order_type";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import secureStorage from "../secureStore";
import { getAccountByUserId } from "@/api/profileApi";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;
  mainRole: string | null;
  account: Account | null;
  deviceResponse: any | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  refreshToken: null,
  mainRole: null,
  account: null,
  deviceResponse: null,
};

interface JwtPayload {
  AccountId: string;
  // Thêm các trường khác nếu cần
}

// Thunk để khởi tạo auth state từ SecureStore
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch }) => {
    const token = await secureStorage.getItem("token");
    const refreshToken = await secureStorage.getItem("refreshToken");

    if (token && refreshToken) {
      try {
        // const decoded = JWT.decode(token, "shh"); // 'shh' là key bạn sử dụng để mã hóa JWT
        const decoded = jwtDecode(token) as JwtPayload;
        console.log("Decoded accountId:", decoded.AccountId);

        // Giả sử token đã được mã hóa với key 'shh' và chứa accountId
        const accountId = decoded.AccountId;

        console.log("Decoded accountId:", accountId);

        if (!accountId) {
          throw new Error("Account ID not found in token");
        }

        // Lấy thông tin tài khoản từ API
        const profileData = await getAccountByUserId(accountId);
        if (profileData.isSuccess) {
          // Nếu lấy thông tin thành công, cập nhật trạng thái đăng nhập
          dispatch(
            login({
              token,
              refreshToken,
              mainRole: "SHIPPER", // Bạn có thể thay đổi `mainRole` nếu cần
              account: profileData.result,
              deviceResponse: null,
            })
          );
        } else {
          // Nếu thất bại, xóa token và refreshToken, sau đó đăng xuất
          await secureStorage.removeItem("token");
          await secureStorage.removeItem("refreshToken");
          dispatch(logout());
        }
      } catch (error) {
        console.error("initializeAuth error:", error);
        // Xóa token không hợp lệ
        await secureStorage.removeItem("token");
        await secureStorage.removeItem("refreshToken");
        dispatch(logout());
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        mainRole: string | null;
        account: Account | null;
        deviceResponse: any | null;
      }>
    ) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.mainRole = action.payload.mainRole;
      state.account = action.payload.account;
      state.deviceResponse = action.payload.deviceResponse;
    },
    setProfile(state, action: PayloadAction<Account>) {
      state.account = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.refreshToken = null;
      state.mainRole = null;
      state.account = null;
      state.deviceResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      // Có thể thêm logic bổ sung nếu cần
    });
  },
});

export const { login, setProfile, logout } = authSlice.actions;
export default authSlice.reducer;

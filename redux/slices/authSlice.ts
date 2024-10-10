import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  deviceId: string | null;
  deviceCode: string | null;
  tableId: string | null;
  tableName: string | null;
  mainRole: string | null; // Thêm thuộc tính này để giữ mainRole
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  deviceId: null,
  deviceCode: null,
  tableId: null,
  tableName: null,
  mainRole: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        token: string;
        deviceResponse: {
          deviceId: string;
          deviceCode: string;
          tableId: string;
          tableName: string;
          mainRole: string;
        };
      }>
    ) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.deviceId = action.payload.deviceResponse.deviceId;
      state.deviceCode = action.payload.deviceResponse.deviceCode;
      state.tableId = action.payload.deviceResponse.tableId;
      state.tableName = action.payload.deviceResponse.tableName;
      state.mainRole = action.payload.deviceResponse.mainRole;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.deviceId = null;
      state.deviceCode = null;
      state.tableId = null;
      state.tableName = null;
      state.mainRole = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

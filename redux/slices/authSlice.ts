import { Account } from "@/app/types/order_type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        mainRole: string;
        account: Account;
        deviceResponse: any;
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
});

export const { login, setProfile, logout } = authSlice.actions;
export default authSlice.reducer;

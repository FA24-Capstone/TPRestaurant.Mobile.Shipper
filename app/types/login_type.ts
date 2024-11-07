export interface LoginResult {
  token: string;
  refreshToken: string | null;
  mainRole: string;
  account: any; // Replace `any` with a specific type if available
  deviceResponse: {
    deviceId: string;
    deviceCode: string;
    devicePassword: string;
    tableId: string;
    tableName: string;
    mainRole: string;
  };
  rememberMe?: boolean;
}

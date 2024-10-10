export interface LoginResponse {
  result: {
    token: string;
    refreshToken: string | null;
    mainRole: string;
    account: any; // You can replace `any` with a specific type if you have it
    deviceResponse: {
      deviceId: string;
      deviceCode: string;
      devicePassword: string;
      tableId: string;
      tableName: string;
      mainRole: string;
    };
  };
  isSuccess: boolean;
  messages: string[];
}

// src/navigation/types/types.ts

export type RootStackParamList = {
  OrderListDelivery: undefined;
  OrderDetail: { orderId: string; typeMap?: string };
  OptimizeDelivery: undefined;
  OrderUpload: undefined;
};

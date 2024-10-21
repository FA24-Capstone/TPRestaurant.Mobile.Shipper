export interface OrderItemProps {
  order: Order;
  selected: boolean;
  onSelect: (orderId: string) => void;
  isPending?: boolean;
  onViewDetail?: (orderId: string) => void; // Cập nhật kiểu
  setIsDelivering?: (isDelivering: boolean) => void; // Cập nhật kiểu
}
//=========== real api ===========

// src/types/orderTypes.ts

// Response for updating order status
export interface UpdateOrderStatusResponse {
  result: string;
  isSuccess: boolean;
  messages: string[];
}

// Response for getting order map
export interface GetOrderMapResponse {
  result: string;
  isSuccess: boolean;
  messages: any[];
}

// Request body for getting optimal path
export type GetOptimalPathRequest = string[];

//=============== Response for getting optimal path =============
export interface GetOptimalPathResponse {
  result: OptimalPathResult[];
  isSuccess: boolean;
  messages: any[];
}

export interface OptimalPathResult {
  index: number;
  accountId: string;
  orders: Order[];
  duration: string;
  distanceFromPreviousDestination: string;
}

export interface AccountCus {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: any;
  gender: boolean;
  address: string;
  isVerified: boolean;
  isDeleted: boolean;
  loyaltyPoint: number;
  avatar: any;
  isManuallyCreated: boolean;
  isDelivering: boolean;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: any;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

//======================= Parameters for getting all orders by status =======================
export interface GetAllOrdersByStatusParams {
  shipperId: string;
  // orderType?: number;
  pageNumber: number;
  pageSize: number;
  status?: number;
}

// Response for getting all orders by status
export interface GetAllOrdersByStatusResponse {
  result: {
    items: Order[];
    totalPages: number;
  };
  isSuccess: boolean;
  messages: string[];
}

// Order interface based on your example response
export interface Order {
  validatingImg?: string;
  orderId: string;
  orderDate: string;
  startDeliveringTime: any;
  assignedTime: any;
  deliveredTime: string | any;
  reservationDate: string | null;
  mealTime: string | null;
  endTime: string | null;
  totalAmount: number;
  statusId: number;
  status: Status;
  accountId: string;
  account: Account;
  loyalPointsHistoryId: string | null;
  loyalPointsHistory: any | null;
  note: string;
  orderTypeId: number;
  orderType: OrderType;
  numOfPeople: number | null;
  deposit: number | null;
  isPrivate: boolean | null;
  orderDetail: OrderDetail;
  itemLeft: number;
  shipperId?: string;
  shipper?: Shipper;
  totalDistance?: number;
  totalDuration?: number;
}

export interface Shipper {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: any;
  gender: boolean;
  address: string;
  isVerified: boolean;
  isDeleted: boolean;
  loyaltyPoint: number;
  avatar: any;
  isManuallyCreated: boolean;
  isDelivering: boolean;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: any;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

export interface Status {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface Account {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: any;
  gender: boolean;
  address: string;
  isVerified: boolean;
  isDeleted: boolean;
  loyaltyPoint: number;
  avatar: any;
  isManuallyCreated: boolean;
  isDelivering: boolean;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: any;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

export interface OrderType {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface OrderDetail {
  orderDetailId: string;
  orderId: string;
  order: any | null;
  dishSizeDetailId: string;
  dishSizeDetail: DishSizeDetail;
  comboId: string | null;
  combo: any | null;
  quantity: number;
  price: number;
  note: string;
  orderTime: string;
  readyToServeTime: string | null;
  orderDetailStatusId: number;
  orderDetailStatus: OrderDetailStatus;
  orderSessionId: string;
  orderSession: any | null;
}

export interface DishSizeDetail {
  dishSizeDetailId: string;
  isAvailable: boolean;
  price: number;
  discount: number;
  dishId: string;
  dish: Dish;
  dishSizeId: number;
  dishSize: DishSize | null;
  quantityLeft: number | null;
  dailyCountdown: number;
}

export interface Dish {
  dishId: string;
  name: string;
  description: string;
  image: string;
  dishItemTypeId: number;
  dishItemType: any | null;
  isAvailable: boolean;
  isDeleted: boolean;
  isMainItem: boolean;
  preparationTime: string | null;
}

export interface OrderDetailStatus {
  id: number;
  name: string;
  vietnameseName: string;
}

// Request body for assigning orders to shipper
export type AssignOrderForShipperRequest = string[];

// Response for assigning orders to shipper
export interface AssignOrderForShipperResponse {
  result: string;
  isSuccess: boolean;
  messages: string[];
}

// Request body for uploading confirmed order image
export interface UploadConfirmedOrderImageRequest {
  orderId: string;
  image: string; // Adjust the type based on your implementation
}

// Response for uploading confirmed order image
export interface UploadConfirmedOrderImageResponse {
  result: string;
  isSuccess: boolean;
  messages: string[];
}

// Response for getting order detail by ID

export interface GetHistoryOrderIdReponse {
  result: OrderHistoryData;
  isSuccess: boolean;
  messages: any[];
}
//

export interface OrderHistoryData {
  order: Order;
  orderDishes: OrderDish[];
  orderTables: OrderTable[];
}
//

export interface OrderTable {
  tableDetailId: string;
  tableId: string;
  table: Table;
  orderId: string;
  order: Order;
  startTime: string;
  endDate: any;
}
//
export interface Table {
  tableId: string;
  tableName: string;
  tableSizeId: number;
  tableSize: any;
  isDeleted: boolean;
  roomId: string;
  room: any;
}
//

export interface OrderDish {
  orderDetailsId: string;
  quantity: number;
  dishSizeDetailId?: string;
  dishSizeDetail?: DishSizeDetail;
  comboDish?: ComboDish;
  note: string;
  orderTime: string;
}
//
export interface ComboDish {
  comboId: string;
  quantity?: number;
  combo: Combo;
  dishCombos: DishCombo[];
}
//
export interface DishCombo {
  dishComboId: string;
  quantity: number;
  dishSizeDetailId: string;
  dishSizeDetail: DishSizeDetailCombo;
  comboOptionSetId: string;
  comboOptionSet: ComboOptionSet;
}
//
export interface ComboOptionSet {
  comboOptionSetId: string;
  optionSetNumber: number;
  numOfChoice: number;
  dishItemTypeId: number;
  dishItemType: any;
  comboId: string;
  combo: any;
}
//
export interface DishSizeDetailCombo {
  dishSizeDetailId: string;
  isAvailable: boolean;
  price: number;
  discount: number;
  dishId: string;
  dish: DishOfCombo;
  dishSizeId: number;
  dishSize: DishSizeInCombo;
}
//
export interface DishSizeInCombo {
  id: number;
  name: string;
  vietnameseName: string;
}
//
export interface DishOfCombo {
  dishId: string;
  name: string;
  description: string;
  image: string;
  dishItemTypeId: number;
  dishItemType: any;
  isAvailable: boolean;
}
//

export interface DishSizeDetail {
  dishSizeDetailId: string;
  quantity?: number;
  startDate?: string;
  endDate?: string;
  isAvailable: boolean;
  price: number;
  discount: number;
  dishId: string;
  dish: Dish;
  dishSizeId: number;
  dishSize: DishSize | null;
}
//

export interface DishSize {
  id: number;
  name: string;
  vietnameseName: string;
}
//

export interface Dish {
  dishId: string;
  name: string;
  description: string;
  image: string;
  dishItemTypeId: number;
  dishItemType: any;
  isAvailable: boolean;
}
//
export interface Combo {
  comboId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discount: number;
  categoryId: number;
  category?: any;
  startDate: string;
  endDate: string;
}
//

// =====   DELIVERY OPTIMAL PATH =============================================
// Define a new interface for grouped deliveries
export interface DeliveryGroup {
  id?: string;
  point: string;
  status: number;
  color: string;
  time: string;
  address1: string;
  address2: string;
  distanceToNextDestination?: string;
  startDeliveringTime?: string;
  deliveredTime?: string;
  assignedTime?: string;
  orders: Delivery[]; // Array of orders for groups with multiple deliveries
}

export interface Delivery {
  id: string;
  status: number;
  color: string;
  time: string;
  distanceToNextDestination?: string;
  startDeliveringTime?: string;
  deliveredTime?: string;
  assignedTime?: string;
  order: Order;
  address1: string;
  address2: string;
}

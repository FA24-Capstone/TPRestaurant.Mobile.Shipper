//============= get account by phone number to get customerInfoAddressId =============

export interface AccountByPhoneReponse {
  result: AccountByPhoneResult;
  isSuccess: boolean;
  messages: any[];
}

export interface AccountByPhoneResult {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: boolean;
  isVerified: boolean;
  userName: string;
  email: string;
  avatar: any;
  addresses: Address[];
  loyalPoint: number;
  storeCredit: number;
  storeCreditId: any;
  storeCreditExpireDay: string;
  isManuallyUpdate: boolean;
  roles: Role[];
  mainRole: string;
}

export interface Address {
  customerInfoAddressId: string;
  customerInfoAddressName: string;
  isCurrentUsed: boolean;
  accountId: string;
  account: any;
  lat: number;
  lng: number;
}

export interface Role {
  id: string;
  name: string;
  normalizedName: string;
  concurrencyStamp: string;
}

//=================== post tính  phí ship order by customerInfoAddressId====================

export interface FeeShipOrderResponse {
  result: number;
  isSuccess: boolean;
  messages: any[];
}

interface Account {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string | null;
  gender: boolean;
  address: string;
  isVerified: boolean;
  isDeleted: boolean;
  loyaltyPoint: number;
  avatar: string | null;
  isManuallyCreated: boolean;
  isDelivering: boolean;
  storeCreditAmount: number;
  expiredDate: string;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string | null;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: string | null;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

interface TokenData {
  tokenId: string;
  accessTokenValue: string;
  deviceIP: string;
  createDateAccessToken: string;
  expiryTimeAccessToken: string;
  refreshTokenValue: string;
  deviceToken: string;
  deviceName: string;
  createRefreshToken: string;
  expiryTimeRefreshToken: string;
  lastLogin: string;
  isActive: boolean;
  accountId: string;
  account: Account;
}

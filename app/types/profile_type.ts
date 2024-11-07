// src/app/types/profile_type.ts
// src/app/types/profile_type.ts

export interface AccountProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string | null;
  gender: boolean;
  address: string | null;
  isVerified: boolean;
  isDeleted: boolean;
  loyaltyPoint: number;
  avatar: string | null;
  isManuallyCreated: boolean;
  isDelivering: boolean;
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

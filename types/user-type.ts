/* =================================================
   ENUMS
================================================= */

export type AccountStatusEnum = "PENDING" | "ACTIVE" | "SUSPENDED" | "LOCKED";

/* =================================================
   USER MODEL
================================================= */

export interface UserDTO {
  id: number;
  email: string;

  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  address: string | null;

  emailVerified: boolean;

  role: String | null;

  accountStatus: AccountStatusEnum;

  lastLoginAt: string | null;

  failedLoginCount: number;

  lockedUntil: string | null;

  passwordChangedAt: string | null;

  tokenVersion: number;

  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

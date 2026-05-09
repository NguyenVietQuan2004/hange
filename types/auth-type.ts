import { ApiResponse } from "@/services/http-service-client";
import { UserDTO } from "./user-type";

/* =================================================
   AUTH CORE TYPES
================================================= */

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  userDTO: UserDTO;
};

/* =================================================
   REQUEST TYPES
================================================= */

export type AuthCredentials = {
  email: string;
  password: string;
};

export type LogoutRequest = AuthToken;

export type LoginNextServerRequest = AuthToken;

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type VerifyEmailRequest = {
  token: string;
};

export type ChangePasswordRequest = {
  oldPassword: string;
  refreshToken: string;
  newPassword: string;
  option?: string;
};

/* =================================================
   UPDATE PROFILE (USER BUT BELONGS TO AUTH FLOW)
================================================= */

export type UpdateProfileRequest = {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
};

/* =================================================
   RESPONSE TYPES
================================================= */

export type LogoutResponse = string;
export type ForgotPasswordResponse = string;
export type ResetPasswordResponse = string;
export type VerifyEmailResponse = string;
export type ChangePasswordResponse = string;

/* =================================================
   API WRAPPER TYPES
================================================= */

export type TokenResponseType = ApiResponse<AuthToken>;
export type RefreshTokenResponseType = ApiResponse<AuthResponse>;
export type LoginResponse = AuthResponse;

/* =================================================
   UPLOAD TYPES
================================================= */

export type UploadRequest = {
  file: File;
  folder: string;
};

export type UploadResponse = {
  filename: string;
};

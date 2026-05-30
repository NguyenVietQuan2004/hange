// src/const/login-error.ts

import { ERROR_CODE } from "@/const/auth/error-auth-code";

export const LOGIN_ERROR_MESSAGE: Record<string, string> = {
  // =========================
  // VALIDATION
  // =========================
  [ERROR_CODE.VALIDATION_FAILED]: "Please enter a valid email and password.",

  // =========================
  // AUTH
  // =========================
  [ERROR_CODE.USER_NOT_FOUND]: "Account information is incorrect.",
  [ERROR_CODE.AUTH_INVALID_CREDENTIALS]: "Account information is incorrect.",

  // =========================
  // ACCOUNT STATUS
  // =========================
  [ERROR_CODE.USER_NOT_ACTIVE]: "Your account is not activated.",

  [ERROR_CODE.EMAIL_NOT_VERIFIED]: "Your email has not been verified.",

  [ERROR_CODE.USER_LOCKED]: "Your account has been locked.",
};

export const LOGIN_RESEND_VERIFICATION_ERRORS = [ERROR_CODE.USER_NOT_ACTIVE, ERROR_CODE.EMAIL_NOT_VERIFIED];

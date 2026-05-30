// src/const/change-password-error.ts

import { ERROR_CODE } from "@/const/auth/error-auth-code";

export const CHANGE_PASSWORD_ERROR_MESSAGE: Record<string, string> = {
  // =========================
  // TOKEN
  // =========================
  [ERROR_CODE.TOKEN_INVALID]: "Your session has expired. Please login again.",

  // =========================
  // VALIDATION
  // =========================
  [ERROR_CODE.VALIDATION_FAILED]: "Please fill in all required fields.",

  // =========================
  // USER
  // =========================
  [ERROR_CODE.USER_NOT_FOUND]: "Account not found.",

  [ERROR_CODE.USER_LOCKED]: "Your account has been locked.",

  // =========================
  // AUTH
  // =========================
  [ERROR_CODE.AUTH_INVALID_CREDENTIALS]: "Current password is incorrect.",

  // =========================
  // PASSWORD
  // =========================
  [ERROR_CODE.PASSWORD_POLICY_VIOLATION]: "Password does not meet security requirements.",

  [ERROR_CODE.PASSWORD_CONFIRMATION_MISMATCH]: "Password confirmation does not match.",

  [ERROR_CODE.PASSWORD_SAME_AS_OLD]: "New password must be different from old password.",
};

export const CHANGE_PASSWORD_FATAL_ERRORS = [
  ERROR_CODE.TOKEN_INVALID,
  ERROR_CODE.USER_LOCKED,
  ERROR_CODE.USER_NOT_FOUND,
];

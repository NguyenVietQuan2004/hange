// src/const/reset-password-error.ts

import { ERROR_CODE } from "@/const/auth/error-auth-code";

export const RESET_PASSWORD_ERROR_MESSAGE: Record<string, string> = {
  // =========================
  // TOKEN ERRORS
  // =========================
  [ERROR_CODE.TOKEN_TYPE_INVALID]: "This reset link is no longer valid.",

  [ERROR_CODE.TOKEN_ALREADY_USED]: "This reset link has already been used.",

  [ERROR_CODE.TOKEN_EXPIRED]: "This reset link has expired.",

  // =========================
  // USER ERRORS
  // =========================
  [ERROR_CODE.USER_LOCKED]: "Your account has been locked.",

  // =========================
  // PASSWORD ERRORS
  // =========================
  [ERROR_CODE.PASSWORD_POLICY_VIOLATION]: "Password does not meet security requirements.",

  [ERROR_CODE.PASSWORD_SAME_AS_OLD]: "New password must be different from old password.",

  [ERROR_CODE.PASSWORD_CONFIRMATION_MISMATCH]: "Passwords do not match.",

  // =========================
  // VALIDATION
  // =========================
  [ERROR_CODE.VALIDATION_FAILED]: "Invalid input.",
};

export const RESET_PASSWORD_FATAL_ERRORS = [
  ERROR_CODE.TOKEN_TYPE_INVALID,
  ERROR_CODE.TOKEN_ALREADY_USED,
  ERROR_CODE.TOKEN_EXPIRED,
  ERROR_CODE.USER_LOCKED,
];

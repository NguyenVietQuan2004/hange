// src/const/verify-email-error.ts

import { ERROR_CODE } from "@/const/error-code";

export const VERIFY_EMAIL_ERROR_MESSAGE: Record<string, string> = {
  // =========================
  // VALIDATION
  // =========================
  [ERROR_CODE.VALIDATION_MISSING_REQUIRED_PARAM_FIELD]: "Verification token is required.",

  // =========================
  // TOKEN
  // =========================
  [ERROR_CODE.TOKEN_TYPE_INVALID]: "This verification link is invalid.",

  [ERROR_CODE.TOKEN_ALREADY_USED]: "This verification link has already been used.",

  [ERROR_CODE.TOKEN_EXPIRED]: "This verification link has expired.",
};

export const VERIFY_EMAIL_FATAL_ERRORS = [
  ERROR_CODE.VALIDATION_MISSING_REQUIRED_PARAM_FIELD,
  ERROR_CODE.TOKEN_TYPE_INVALID,
  ERROR_CODE.TOKEN_ALREADY_USED,
  ERROR_CODE.TOKEN_EXPIRED,
];

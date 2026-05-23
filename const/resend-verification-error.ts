// src/const/resend-verification-error.ts

import { ERROR_CODE } from "@/const/error-code";

export const RESEND_VERIFICATION_ERROR_MESSAGE: Record<string, string> = {
  [ERROR_CODE.VALIDATION_FAILED]: "Invalid email address.",

  [ERROR_CODE.USER_NOT_FOUND]: "Account not found.",

  [ERROR_CODE.EMAIL_ALREADY_VERIFIED]: "Email already verified.",

  [ERROR_CODE.USER_LOCKED]: "Your account has been locked.",

  [ERROR_CODE.TOO_MANY_REQUESTS]: "Too many requests. Please try again later.",
};

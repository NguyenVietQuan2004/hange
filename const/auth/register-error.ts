// src/const/register-error.ts

import { ERROR_CODE } from "@/const/auth/error-auth-code";

export const REGISTER_ERROR_MESSAGE: Record<string, string> = {
  // =========================
  // VALIDATION
  // =========================
  [ERROR_CODE.VALIDATION_FAILED]: "Please enter a valid email and password.",

  // =========================
  // EMAIL
  // =========================
  [ERROR_CODE.EMAIL_ALREADY_EXISTS]: "Email already exists.",

  // =========================
  // PASSWORD
  // =========================
  [ERROR_CODE.PASSWORD_POLICY_VIOLATION]: "Password does not meet security requirements.",
};

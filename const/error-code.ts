export const ERROR_CODE = {
  /* =================================================
   * USER
  ================================================= */
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_NOT_ACTIVE: "USER_NOT_ACTIVE",
  USER_LOCKED: "USER_LOCKED",
  ACCOUNT_DISABLED: "ACCOUNT_DISABLED",

  /* =================================================
   * EMAIL
  ================================================= */
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  EMAIL_ALREADY_VERIFIED: "EMAIL_ALREADY_VERIFIED",

  /* =================================================
   * AUTH
  ================================================= */
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  WRONG_PASSWORD: "WRONG_PASSWORD",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  UNAUTHORIZED: "UNAUTHORIZED",

  /* =================================================
   * ROLE
  ================================================= */
  ROLE_NOT_FOUND: "ROLE_NOT_FOUND",
  ROLE_ALREADY_EXISTS: "ROLE_ALREADY_EXISTS",
  INVALID_ROLE: "INVALID_ROLE",
  INVALID_ROLE_NAME: "INVALID_ROLE_NAME",
  ROLE_IN_USE: "ROLE_IN_USE",
  ROLE_CANNOT_BE_DELETED: "ROLE_CANNOT_BE_DELETED",
  ROLE_ALREADY_ASSIGNED: "ROLE_ALREADY_ASSIGNED",
  ROLE_NOT_ASSIGNED: "ROLE_NOT_ASSIGNED",

  /* =================================================
   * ROLE - PERMISSION
  ================================================= */
  ROLE_PERMISSION_CONFLICT: "ROLE_PERMISSION_CONFLICT",
  ROLE_HAS_NO_PERMISSIONS: "ROLE_HAS_NO_PERMISSIONS",

  /* =================================================
   * PERMISSION
  ================================================= */
  PERMISSION_NOT_FOUND: "PERMISSION_NOT_FOUND",
  PERMISSION_ALREADY_EXISTS: "PERMISSION_ALREADY_EXISTS",
  PERMISSION_ALREADY_ASSIGNED: "PERMISSION_ALREADY_ASSIGNED",
  PERMISSION_NOT_ASSIGNED: "PERMISSION_NOT_ASSIGNED",
  INVALID_PERMISSION: "INVALID_PERMISSION",

  /* =================================================
   * TOKEN (GENERAL)
  ================================================= */
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_REVOKED: "TOKEN_REVOKED",
  TOKEN_NOT_FOUND: "TOKEN_NOT_FOUND",
  TOKEN_ALREADY_REVOKED: "TOKEN_ALREADY_REVOKED",
  INVALID_TOKEN_VERSION: "INVALID_TOKEN_VERSION",
  USED_TOKEN: "USED_TOKEN",

  /* =================================================
   * REFRESH TOKEN
  ================================================= */
  INVALID_REFRESH_TOKEN: "INVALID_REFRESH_TOKEN",
  REFRESH_TOKEN_EXPIRED: "REFRESH_TOKEN_EXPIRED",
  REFRESH_TOKEN_REVOKED: "REFRESH_TOKEN_REVOKED",
  REFRESH_TOKEN_NOT_FOUND: "REFRESH_TOKEN_NOT_FOUND",
  REFRESH_TOKEN_ALREADY_REVOKED: "REFRESH_TOKEN_ALREADY_REVOKED",

  /* =================================================
   * FILE
  ================================================= */
  FILE_EMPTY: "FILE_EMPTY",
  INVALID_FILE_NAME: "INVALID_FILE_NAME",
  UNSUPPORTED_EXTENSION: "UNSUPPORTED_EXTENSION",
  UNSUPPORTED_MIME_TYPE: "UNSUPPORTED_MIME_TYPE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  FILE_UPLOAD_FAILED: "FILE_UPLOAD_FAILED",
  MISSING_REQUIRED_PARAMS: "MISSING_REQUIRED_PARAMS",
  FILE_NOT_FOUND: "FILE_NOT_FOUND",

  /* =================================================
   * FOLDER
  ================================================= */
  CREATE_FOLDER_FAILED: "CREATE_FOLDER_FAILED",
  FOLDER_INVALID: "FOLDER_INVALID",
  FOLDER_PERMISSION_DENIED: "FOLDER_PERMISSION_DENIED",

  /* =================================================
   * SECURITY UPLOAD
  ================================================= */
  FILE_NAME_PATH_TRAVERSAL: "FILE_NAME_PATH_TRAVERSAL",
  FILE_SUSPICIOUS_CONTENT: "FILE_SUSPICIOUS_CONTENT",

  /* =================================================
   * VALIDATION (FRONTEND ONLY)
  ================================================= */
  VALIDATION_ERROR: "VALIDATION_ERROR",
} as const;

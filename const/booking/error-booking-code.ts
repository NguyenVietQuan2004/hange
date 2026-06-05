export const ERROR_BOOKING_CODE = {
  /* =================================================
   * CATEGORY
   * ================================================= */
  CATEGORY_NOT_FOUND: "CATEGORY_NOT_FOUND",
  CATEGORY_SLUG_ALREADY_EXISTS: "CATEGORY_SLUG_ALREADY_EXISTS",

  /* =================================================
   * NOTIFICATION
   * ================================================= */
  NOTIFICATION_NOT_FOUND: "NOTIFICATION_NOT_FOUND",

  /* =================================================
   * SERVICE
   * ================================================= */
  SERVICE_NOT_FOUND: "SERVICE_NOT_FOUND",
  SERVICE_SLUG_ALREADY_EXISTS: "SERVICE_SLUG_ALREADY_EXISTS",

  /* =================================================
   * SERVICE SLOT
   * ================================================= */
  SERVICE_SLOT_NOT_FOUND: "SERVICE_SLOT_NOT_FOUND",
  DUPLICATE_SLOT: "DUPLICATE_SLOT",
  INVALID_TIME_RANGE: "INVALID_TIME_RANGE",
  INVALID_MAX_CAPACITY: "INVALID_MAX_CAPACITY",
  TIME_OVERLAP: "TIME_OVERLAP",
  SLOT_FULL: "SLOT_FULL",
  INVALID_BOOKED_COUNT: "INVALID_BOOKED_COUNT",

  /* =================================================
   * LOCATION
   * ================================================= */
  LOCATION_NOT_FOUND: "LOCATION_NOT_FOUND",
  LOCATION_TIME_INVALID: "LOCATION_TIME_INVALID",
  LOCATION_SLUG_ALREADY_EXISTS: "LOCATION_SLUG_ALREADY_EXISTS",

  /* =================================================
   * BOOKING
   * ================================================= */
  BOOKING_NOT_FOUND: "BOOKING_NOT_FOUND",
  BOOKING_TIME_INVALID: "BOOKING_TIME_INVALID",
  SLOT_NOT_AVAILABLE: "SLOT_NOT_AVAILABLE",
  DUPLICATE_BOOKING: "DUPLICATE_BOOKING",
  BOOKING_STATUS_INVALID: "BOOKING_STATUS_INVALID",
  BOOKING_RATE_LIMIT: "BOOKING_RATE_LIMIT",

  /* =================================================
   * VALIDATION
   * ================================================= */
  INVALID_DURATION: "INVALID_DURATION",
  INVALID_PRICE: "INVALID_PRICE",
} as const;

export type ErrorCodeType = keyof typeof ERROR_BOOKING_CODE;

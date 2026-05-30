import { ApiResponse } from "@/services/http-service-client";

/* =================================================
   ENUM (MATCH BACKEND NotificationType)
================================================= */

export type NotificationType = "BOOKING_CREATED" | "CONFIRMED" | "REJECTED" | "CANCELLED";

/* =================================================
   DTO
================================================= */

export type NotificationDTO = {
  id: number;

  userId: number;
  bookingId: number;

  type: NotificationType;

  title: string;
  message: string;

  isRead: boolean;

  createdAt: string;
};

/* =================================================
   REQUEST CREATE
================================================= */

export type CreateNotificationRequest = {
  userId: number;
  bookingId: number;
  type: NotificationType;

  title: string;
  message: string;
};

/* =================================================
   RESPONSE TYPES
================================================= */

export type NotificationListResponse = ApiResponse<NotificationDTO[]>;
export type NotificationResponse = ApiResponse<NotificationDTO>;
export type DeleteNotificationResponse = ApiResponse<string>;
export type MarkAllReadResponse = ApiResponse<string>;

/* =================================================
   QUERY (FUTURE USE)
================================================= */

export type NotificationQueryParams = {
  userId?: number;
  isRead?: boolean;
  type?: NotificationType;
  page?: number;
  size?: number;
  sort?: string;
};

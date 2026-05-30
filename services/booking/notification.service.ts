import { api } from "@/services/http-service-client";
import { API_URL } from "@/utils/api";
import { NotificationDTO, CreateNotificationRequest } from "@/types/booking/notification-type";

export const notificationService = {
  /* ================= GET ================= */

  getAll: async () => {
    return api.get<NotificationDTO[]>(API_URL.NOTIFICATION.GET_ALL);
  },

  getByUser: async (userId: number) => {
    return api.get<NotificationDTO[]>(API_URL.NOTIFICATION.GET_BY_USER(userId));
  },

  /* ================= CREATE ================= */

  create: async (payload: CreateNotificationRequest) => {
    return api.post<NotificationDTO, CreateNotificationRequest>(API_URL.NOTIFICATION.CREATE, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  /* ================= READ STATUS ================= */

  markAsRead: async (id: number) => {
    return api.patch<NotificationDTO>(API_URL.NOTIFICATION.MARK_READ(id), {});
  },

  markAllRead: async (userId: number) => {
    return api.patch<string>(API_URL.NOTIFICATION.MARK_ALL_READ(userId), {});
  },

  /* ================= DELETE ================= */

  remove: async (id: number) => {
    return api.delete<string>(API_URL.NOTIFICATION.DELETE(id));
  },
};

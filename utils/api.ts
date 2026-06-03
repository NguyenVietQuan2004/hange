import { ENV_CONFIG } from "@/config/env";
import { PermissionQueryParams } from "@/types/auth/role-type";
import { BookingQueryParams } from "@/types/booking/booking-type";
import { SlotQueryParams } from "@/types/booking/service-slot-type";

const api = (path: string) => `${ENV_CONFIG.API_URL}${path}`;

const app = (path: string) => `${ENV_CONFIG.APP_URL}${path}`;

export const API_URL = {
  BASE: ENV_CONFIG.API_URL,

  AUTH: {
    LOGIN: api("/auth/login"),
    LOGOUT: api("/auth/logout"),
    REGISTER: api("/auth/register"),
    REFRESH: api("/auth/refresh-token"),
    CHANGE_PASSWORD: api("/auth/change-password"),
    FORGOT_PASSWORD: api("/auth/forgot-password"),
    RESEND_EMAIL_VERIFICATION: api("/auth/resend-verification"),
    RESET_PASSWORD: api("/auth/reset-password"),
    VERIFY_EMAIL: api("/auth/verify-email"),
    PING: api("/ping"),
  },

  NEXT_SERVER: {
    LOGIN: app("/api/login"),
    LOGOUT: app("/api/logout"),
    TOKENS: app("/api/tokens"),
  },

  USER: {
    GET_ME: api("/users/me"),
    UPDATE_PROFILE: api("/users/update-profile"),
  },

  FILES: {
    UPLOAD: api("/files"),
  },

  PERMISSION: {
    BASE: api("/permissions"),
    // GET_ALL: api("/permissions?page=1&size=5&sort=name,desc&keyword=u"), // cac cai con lai la exact
    GET_ALL: (params?: PermissionQueryParams) =>
      api(
        `/permissions?${new URLSearchParams({
          ...(params?.keyword && { keyword: params.keyword }),
          ...(params?.module && { module: params.module }),
          ...(params?.method && { method: params.method }),
          ...(params?.apiPath && { apiPath: params.apiPath }),
          ...(params?.page !== undefined && {
            page: params.page.toString(),
          }),
          ...(params?.size !== undefined && {
            size: params.size.toString(),
          }),
          ...(params?.sort && {
            sort: params.sort,
          }),
        }).toString()}`,
      ),
    //     GET /api/v1/permissions?
    // keyword=user&
    // module=AUTH&
    // method=GET&
    // apiPath=
    // page=0&
    // size=5&
    // sort=name,asc
    CREATE: api("/permissions"),
    UPDATE: (id: number) => api(`/permissions/${id}`),
    DELETE: (id: number) => api(`/permissions/${id}`),
  },

  ROLE: {
    BASE: api("/roles"),
    GET_ALL: api("/roles"),
    CREATE: api("/roles"),
    UPDATE: (id: number) => api(`/roles/${id}`),
    DELETE: (id: number) => api(`/roles/${id}`),
  },

  CATEGORY: {
    BASE: api("/categories"),

    GET_ALL: api("/categories"),
    GET_BY_ID: (id: number) => api(`/categories/${id}`),
    GET_BY_SLUG: (slug: string) => api(`/categories/slug/${slug}`),

    CREATE: api("/categories"),
    UPDATE: (id: number) => api(`/categories/${id}`),
    REPLACE: (id: number) => api(`/categories/${id}`),

    DELETE: (id: number) => api(`/categories/${id}`),
  },

  SERVICE: {
    BASE: api("/services"),

    GET_ALL: api("/services"),
    GET_BY_ID: (id: number) => api(`/services/${id}`),
    GET_BY_SLUG: (slug: string) => api(`/services/slug/${slug}`),

    CREATE: api("/services"),
    UPDATE: (id: number) => api(`/services/${id}`),
    DELETE: (id: number) => api(`/services/${id}`),
  },
  LOCATION: {
    BASE: api("/locations"),

    GET_ALL: api("/locations"),
    GET_BY_ID: (id: number) => api(`/locations/${id}`),
    GET_BY_SLUG: (slug: string) => api(`/locations/slug/${slug}`),

    CREATE: api("/locations"),
    UPDATE: (id: number) => api(`/locations/${id}`),
    DELETE: (id: number) => api(`/locations/${id}`),
  },

  NOTIFICATION: {
    BASE: api("/notifications"),

    GET_ALL: api("/notifications"),

    GET_BY_USER: (userId: number) => api(`/notifications/user/${userId}`),

    CREATE: api("/notifications"),

    MARK_READ: (id: number) => api(`/notifications/${id}/read`),

    MARK_ALL_READ: (userId: number) => api(`/notifications/user/${userId}/read-all`),

    DELETE: (id: number) => api(`/notifications/${id}`),
  },

  BOOKING: {
    BASE: api("/bookings"),

    CREATE: api("/bookings"),

    GET_ALL: (params?: BookingQueryParams) =>
      api(
        `/bookings?${new URLSearchParams({
          ...(params?.page !== undefined && {
            page: params.page.toString(),
          }),
          ...(params?.size !== undefined && {
            size: params.size.toString(),
          }),
          ...(params?.sort && {
            sort: params.sort,
          }),
        }).toString()}`,
      ),
    GET_BY_ID: (id: number) => api(`/bookings/${id}`),

    MY_BOOKINGS: api("/bookings/me"),

    CONFIRM: (id: number) => api(`/bookings/${id}/confirm`),
    REJECT: (id: number) => api(`/bookings/${id}/reject`),
    CANCEL: (id: number) => api(`/bookings/${id}/cancel`),
  },

  SERVICE_SLOT: {
    BASE: api("/service-slots"),
    GET_ALL: (params?: SlotQueryParams) =>
      api(
        `/service-slots?${new URLSearchParams({
          ...(params?.serviceId !== undefined && {
            serviceId: params.serviceId.toString(),
          }),
          ...(params?.locationId !== undefined && {
            locationId: params.locationId.toString(),
          }),
          ...(params?.slotDate && {
            slotDate: params.slotDate,
          }),
          ...(params?.page !== undefined && {
            page: params.page.toString(),
          }),
          ...(params?.size !== undefined && {
            size: params.size.toString(),
          }),
          ...(params?.sort && {
            sort: params.sort,
          }),
        }).toString()}`,
      ),

    GET_BY_ID: (id: number) => api(`/service-slots/${id}`),
    GET_LOCATIONS_BY_SERVICE: (serviceId: number) => api(`/service-slots/service/${serviceId}/locations`),

    GET_BY_SERVICE: (serviceId: number) => api(`/service-slots/service/${serviceId}`),

    CREATE: api("/service-slots"),
    BULK_CREATE: api("/service-slots/bulk"),

    UPDATE: (id: number) => api(`/service-slots/${id}`),
    DELETE: (id: number) => api(`/service-slots/${id}`),
  },
};

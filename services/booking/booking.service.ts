import { api } from "@/services/http-service-client";
import { API_URL } from "@/utils/api";
import {
  BookingDTO,
  BookingListResponse,
  BookingQueryParams,
  CreateBookingRequest,
} from "@/types/booking/booking-type";
import { PageResponse } from "@/types/page-response";

export const bookingService = {
  /* ================= CREATE ================= */

  create: async (payload: CreateBookingRequest) => {
    return api.post<BookingDTO, CreateBookingRequest>(API_URL.BOOKING.CREATE, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  /* ================= GET ================= */

  getAll: async (params?: BookingQueryParams) => {
    return api.get<PageResponse<BookingDTO>>(API_URL.BOOKING.GET_ALL(params));
  },

  getById: async (id: number) => {
    return api.get<BookingDTO>(API_URL.BOOKING.GET_BY_ID(id));
  },

  getMyBookings: async () => {
    return api.get<BookingDTO[]>(API_URL.BOOKING.MY_BOOKINGS, { auth: true });
  },

  /* ================= ACTIONS ================= */

  confirm: async (id: number) => {
    return api.patch<BookingDTO>(API_URL.BOOKING.CONFIRM(id), {});
  },

  reject: async (id: number) => {
    return api.patch<BookingDTO>(API_URL.BOOKING.REJECT(id), {});
  },

  cancel: async (id: number) => {
    return api.patch<BookingDTO>(API_URL.BOOKING.CANCEL(id), {});
  },
};

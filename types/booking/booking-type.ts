import { ApiResponse } from "@/services/http-service-client";
import { UserDTO } from "../user-type";
import { PageResponse } from "../page-response";

/* =================================================
   ENUM STATUS (MATCH BACKEND BookingStatus)
================================================= */

export type BookingStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "COMPLETED" | string;

/* =================================================
   REQUEST CREATE
================================================= */

export type CreateBookingRequest = {
  slotId: number;
  note?: string;
};

/* =================================================
   DTO RESPONSE
================================================= */

export type BookingDTO = {
  id: number;

  userDTO: UserDTO;
  slotId: number;

  status: BookingStatus;

  slotDate: string;

  slotTimeStart: string;
  slotTimeEnd: string;

  serviceName: string;
  servicePrice?: number;
  serviceDuration?: number;

  locationName?: string;
  locationAddress?: string;

  note?: string;

  createdAt: string;
};

/* =================================================
   RESPONSE WRAPPERS
================================================= */

export type BookingListResponse = ApiResponse<PageResponse<BookingDTO>>;
export type BookingResponse = ApiResponse<BookingDTO>;
export type DeleteBookingResponse = ApiResponse<string>;

/* =================================================
   QUERY PARAMS (FUTURE)
================================================= */

export type BookingQueryParams = {
  page?: number;
  size?: number;
  sort?: string;
};

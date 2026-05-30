import { ApiResponse } from "@/services/http-service-client";

/* =================================================
   LOCATION DTO
================================================= */

export type LocationDTO = {
  id: number;

  name: string;
  slug: string;

  address?: string;
  phone?: string;
  mapEmbedUrl?: string;

  openTime?: string; // LocalTime -> string (HH:mm:ss)
  closeTime?: string;

  createdAt?: string;
  updatedAt?: string;
};

/* =================================================
   REQUEST CREATE
================================================= */

export type CreateLocationRequest = {
  name: string;
  slug: string;

  address?: string;
  phone?: string;
  mapEmbedUrl?: string;

  openTime?: string;
  closeTime?: string;
};

/* =================================================
   REQUEST UPDATE
================================================= */

export type UpdateLocationRequest = {
  name?: string;
  slug?: string;

  address?: string;
  phone?: string;
  mapEmbedUrl?: string;

  openTime?: string;
  closeTime?: string;
};

/* =================================================
   RESPONSE TYPES
================================================= */

export type LocationListResponse = ApiResponse<LocationDTO[]>;
export type LocationResponse = ApiResponse<LocationDTO>;
export type DeleteLocationResponse = ApiResponse<string>;

/* =================================================
   QUERY PARAMS (FUTURE)
================================================= */

export type LocationQueryParams = {
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
};

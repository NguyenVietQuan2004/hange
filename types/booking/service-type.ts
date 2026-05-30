import { ApiResponse } from "@/services/http-service-client";

/* =================================================
   IMAGE
================================================= */

export type ImageDTO = {
  id?: number;
  url: string;
  description?: string;
};

/* =================================================
   SERVICE DTO
================================================= */

export type ServiceDTO = {
  id: number;

  name: string;
  slug: string;

  description?: string;
  content?: string;

  durationMinutes: number;
  price: number;

  categoryId: number;
  categoryName?: string;

  images?: ImageDTO[];

  createdAt?: string;
  updatedAt?: string;
};

/* =================================================
   REQUEST CREATE
================================================= */

export type CreateServiceRequest = {
  name: string;
  slug: string;

  description?: string;
  content?: string;

  durationMinutes: number;
  price: number;

  categoryId: number;

  images?: ImageDTO[];
};

/* =================================================
   REQUEST UPDATE
================================================= */

export type UpdateServiceRequest = {
  name?: string;
  slug?: string;

  description?: string;
  content?: string;

  durationMinutes?: number;
  price?: number;

  categoryId?: number;

  images?: ImageDTO[];
};

/* =================================================
   RESPONSE WRAPPER
================================================= */

export type ServiceListResponse = ApiResponse<ServiceDTO[]>;
export type ServiceResponse = ApiResponse<ServiceDTO>;
export type DeleteServiceResponse = ApiResponse<string>;

/* =================================================
   QUERY PARAMS (FUTURE)
================================================= */

export type ServiceQueryParams = {
  keyword?: string;
  categoryId?: number;
  page?: number;
  size?: number;
  sort?: string;
};

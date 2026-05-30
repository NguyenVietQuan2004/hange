import { ApiResponse } from "@/services/http-service-client";

/* =================================================
   IMAGE TYPE (match backend DTO)
================================================= */

export type ImageDTO = {
  id?: number;
  url: string;
  description?: string;
};

/* =================================================
   CATEGORY DTO
================================================= */

export type CategoryDTO = {
  id: number;

  name: string;
  slug: string;

  description?: string;
  content?: string;

  images?: ImageDTO[];

  createdAt?: string;
  updatedAt?: string;
};

/* =================================================
   REQUEST TYPES
================================================= */

export type CreateCategoryRequest = {
  name: string;
  slug: string;
  description?: string;
  content?: string;

  images?: ImageDTO[];
};

export type UpdateCategoryRequest = {
  name?: string;
  slug?: string;
  description?: string;
  content?: string;

  images?: ImageDTO[];
};

/* =================================================
   RESPONSE WRAPPER TYPES
================================================= */

export type CategoryListResponse = ApiResponse<CategoryDTO[]>;
export type CategoryResponse = ApiResponse<CategoryDTO>;
export type DeleteCategoryResponse = ApiResponse<string>;

/* =================================================
   QUERY (optional for frontend filter)
================================================= */

export type CategoryQueryParams = {
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
};

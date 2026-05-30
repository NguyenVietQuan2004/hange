import { api } from "@/services/http-service-client";
import { CategoryDTO, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/booking/category-type";
import { API_URL } from "@/utils/api";

export const categoryService = {
  /* ================= GET ================= */

  getAll: async () => {
    return api.get<CategoryDTO[]>(API_URL.CATEGORY.GET_ALL);
  },

  getById: async (id: number) => {
    return api.get<CategoryDTO>(API_URL.CATEGORY.GET_BY_ID(id));
  },

  getBySlug: async (slug: string) => {
    return api.get<CategoryDTO>(API_URL.CATEGORY.GET_BY_SLUG(slug));
  },

  /* ================= CREATE ================= */

  create: async (payload: CreateCategoryRequest) => {
    return api.post<CategoryDTO, CreateCategoryRequest>(API_URL.CATEGORY.CREATE, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  /* ================= UPDATE (PATCH) ================= */

  update: async (id: number, payload: UpdateCategoryRequest) => {
    return api.patch<CategoryDTO, UpdateCategoryRequest>(API_URL.CATEGORY.UPDATE(id), payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  /* ================= REPLACE (PUT) ================= */

  replace: async (id: number, payload: CreateCategoryRequest) => {
    return api.put<CategoryDTO, CreateCategoryRequest>(API_URL.CATEGORY.REPLACE(id), payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  /* ================= DELETE ================= */

  remove: async (id: number) => {
    return api.delete<string>(API_URL.CATEGORY.DELETE(id));
  },
};

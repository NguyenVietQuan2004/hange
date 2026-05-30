import { api } from "@/services/http-service-client";
import { API_URL } from "@/utils/api";
import { ServiceDTO, CreateServiceRequest, UpdateServiceRequest } from "@/types/booking/service-type";

export const serviceService = {
  /* ================= GET ================= */

  getAll: async () => {
    return api.get<ServiceDTO[]>(API_URL.SERVICE.GET_ALL);
  },

  getById: async (id: number) => {
    return api.get<ServiceDTO>(API_URL.SERVICE.GET_BY_ID(id));
  },

  getBySlug: async (slug: string) => {
    return api.get<ServiceDTO>(API_URL.SERVICE.GET_BY_SLUG(slug));
  },

  /* ================= CREATE ================= */

  create: async (payload: CreateServiceRequest) => {
    return api.post<ServiceDTO, CreateServiceRequest>(API_URL.SERVICE.CREATE, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  /* ================= UPDATE ================= */

  update: async (id: number, payload: UpdateServiceRequest) => {
    return api.put<ServiceDTO, UpdateServiceRequest>(API_URL.SERVICE.UPDATE(id), payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  /* ================= DELETE ================= */

  remove: async (id: number) => {
    return api.delete<string>(API_URL.SERVICE.DELETE(id));
  },
};

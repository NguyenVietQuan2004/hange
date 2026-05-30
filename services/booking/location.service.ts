import { api } from "@/services/http-service-client";
import { API_URL } from "@/utils/api";
import { LocationDTO, CreateLocationRequest, UpdateLocationRequest } from "@/types/booking/location-type";

export const locationService = {
  /* ================= GET ================= */

  getAll: async () => {
    return api.get<LocationDTO[]>(API_URL.LOCATION.GET_ALL);
  },

  getById: async (id: number) => {
    return api.get<LocationDTO>(API_URL.LOCATION.GET_BY_ID(id));
  },

  getBySlug: async (slug: string) => {
    return api.get<LocationDTO>(API_URL.LOCATION.GET_BY_SLUG(slug));
  },

  /* ================= CREATE ================= */

  create: async (payload: CreateLocationRequest) => {
    return api.post<LocationDTO, CreateLocationRequest>(API_URL.LOCATION.CREATE, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  /* ================= UPDATE ================= */

  update: async (id: number, payload: UpdateLocationRequest) => {
    return api.put<LocationDTO, UpdateLocationRequest>(API_URL.LOCATION.UPDATE(id), payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  /* ================= DELETE ================= */

  remove: async (id: number) => {
    return api.delete<string>(API_URL.LOCATION.DELETE(id));
  },
};

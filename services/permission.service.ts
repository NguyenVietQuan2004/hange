import { api } from "@/services/http-service-client";
import { API_URL } from "@/utils/api";
import { Permission } from "@/types/role-type";

export const permissionService = {
  getAll: async () => {
    return api.get<Permission[]>(API_URL.PERMISSION.GET_ALL);
  },

  create: async (payload: Omit<Permission, "id">) => {
    return api.post<Permission, Omit<Permission, "id">>(API_URL.PERMISSION.CREATE, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  update: async (id: number, payload: Partial<Permission>) => {
    return api.put<Permission, Partial<Permission>>(API_URL.PERMISSION.UPDATE(id), payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  remove: async (id: number) => {
    return api.delete(API_URL.PERMISSION.DELETE(id));
  },
};

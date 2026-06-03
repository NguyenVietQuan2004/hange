import { api } from "@/services/http-service-client";
import { API_URL } from "@/utils/api";
import { Permission, PermissionQueryParams } from "@/types/auth/role-type";
import { PageResponse } from "@/types/page-response";

export const permissionService = {
  getAll: async (params?: PermissionQueryParams) => {
    return api.get<PageResponse<Permission>>(API_URL.PERMISSION.GET_ALL(params));
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

import { api } from "@/services/http-service-client";
import { API_URL } from "@/utils/api";
import { Role, RoleCreateRequest, RoleUpdateRequest } from "@/types/role-type";

export const roleService = {
  getAll: async () => {
    return api.get<Role[]>(API_URL.ROLE.GET_ALL);
  },

  getById: async (id: number) => {
    return api.get<Role>(`${API_URL.ROLE.BASE}/${id}`);
  },

  create: async (payload: RoleCreateRequest) => {
    return api.post<Role, RoleCreateRequest>(API_URL.ROLE.CREATE, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  update: async (id: number, payload: RoleUpdateRequest) => {
    return api.put<Role, RoleUpdateRequest>(API_URL.ROLE.UPDATE(id), payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  remove: async (id: number) => {
    return api.delete(API_URL.ROLE.DELETE(id));
  },
};

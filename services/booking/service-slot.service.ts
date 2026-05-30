import { api } from "@/services/http-service-client";
import { API_URL } from "@/utils/api";
import {
  ServiceSlotDTO,
  CreateServiceSlotRequest,
  UpdateServiceSlotRequest,
  BulkCreateServiceSlotRequest,
} from "@/types/booking/service-slot-type";

export const serviceSlotService = {
  /* ================= GET ================= */

  getAll: async () => {
    return api.get<ServiceSlotDTO[]>(API_URL.SERVICE_SLOT.GET_ALL);
  },

  getById: async (id: number) => {
    return api.get<ServiceSlotDTO>(API_URL.SERVICE_SLOT.GET_BY_ID(id));
  },

  getByService: async (serviceId: number) => {
    return api.get<ServiceSlotDTO[]>(API_URL.SERVICE_SLOT.GET_BY_SERVICE(serviceId));
  },

  /* ================= CREATE ================= */

  create: async (payload: CreateServiceSlotRequest) => {
    return api.post<ServiceSlotDTO, CreateServiceSlotRequest>(API_URL.SERVICE_SLOT.CREATE, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  bulkCreate: async (payload: BulkCreateServiceSlotRequest) => {
    return api.post<ServiceSlotDTO[], BulkCreateServiceSlotRequest>(API_URL.SERVICE_SLOT.BULK_CREATE, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  /* ================= UPDATE ================= */

  update: async (id: number, payload: UpdateServiceSlotRequest) => {
    return api.put<ServiceSlotDTO, UpdateServiceSlotRequest>(API_URL.SERVICE_SLOT.UPDATE(id), payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  /* ================= DELETE ================= */

  remove: async (id: number) => {
    return api.delete<string>(API_URL.SERVICE_SLOT.DELETE(id));
  },
};

import { ApiResponse } from "@/services/http-service-client";

/* =================================================
   SLOT ITEM (bulk create)
================================================= */

export type SlotItemDTO = {
  startTime: string;
  endTime: string;
  maxCapacity: number;
};

/* =================================================
   SERVICE SLOT DTO
================================================= */

export type ServiceSlotDTO = {
  id: number;

  serviceId: number;
  locationId: number;

  slotDate: string;

  startTime: string;
  endTime: string;

  maxCapacity: number;
  bookedCount: number;
};

/* =================================================
   REQUEST CREATE
================================================= */

export type CreateServiceSlotRequest = {
  serviceId: number;
  locationId: number;

  slotDate: string;

  startTime: string;
  endTime: string;

  maxCapacity: number;
};

/* =================================================
   REQUEST UPDATE
================================================= */

export type UpdateServiceSlotRequest = {
  slotDate?: string;
  startTime?: string;
  endTime?: string;

  maxCapacity?: number;
};

/* =================================================
   BULK CREATE
================================================= */

export type BulkCreateServiceSlotRequest = {
  serviceId: number;

  locationIds: number[];

  slotDate: string;

  slots: SlotItemDTO[];
};

/* =================================================
   RESPONSE TYPES
================================================= */

export type ServiceSlotListResponse = ApiResponse<ServiceSlotDTO[]>;
export type ServiceSlotResponse = ApiResponse<ServiceSlotDTO>;
export type DeleteServiceSlotResponse = ApiResponse<string>;

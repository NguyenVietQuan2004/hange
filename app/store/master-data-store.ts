// store/master-data-store.ts

import { create } from "zustand";
import { ServiceDTO } from "@/types/booking/service-type";
import { LocationDTO } from "@/types/booking/location-type";
import { serviceService } from "@/services/booking/service.service";
import { locationService } from "@/services/booking/location.service";
import { CategoryDTO } from "@/types/booking/category-type";
import { categoryService } from "@/services/booking/category.service";

export interface MasterDataState {
  services: ServiceDTO[];
  locations: LocationDTO[];
  categories: CategoryDTO[];

  loadingServices: boolean;
  loadingLocations: boolean;
  loadingCategories: boolean;

  fetchServices: () => Promise<void>;
  fetchLocations: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchAll: () => Promise<void>;

  clear: () => void;
}

export const useMasterDataStore = create<MasterDataState>((set: any, get: any) => ({
  services: [],
  locations: [],
  categories: [],

  loadingServices: false,
  loadingLocations: false,
  loadingCategories: false,

  fetchServices: async () => {
    const { services, loadingServices } = get();

    if (services.length > 0 || loadingServices) return;

    set({ loadingServices: true });

    try {
      const response = await serviceService.getAll();
      set({
        // services: response || [],
        services: duplicateData(response || [], 1),
      });
    } finally {
      set({ loadingServices: false });
    }
  },

  fetchLocations: async () => {
    const { locations, loadingLocations } = get();
    if (locations.length > 0 || loadingLocations) return;

    set({ loadingLocations: true });

    try {
      const response = await locationService.getAll();

      set({
        locations: response || [],
      });
    } finally {
      set({ loadingLocations: false });
    }
  },

  fetchCategories: async () => {
    const { categories, loadingCategories } = get();
    if (categories.length > 0 || loadingCategories) return;

    set({ loadingCategories: true });

    try {
      const response = await categoryService.getAll();

      set({
        categories: response || [],
      });
    } finally {
      set({ loadingCategories: false });
    }
  },

  fetchAll: async () => {
    await Promise.all([get().fetchServices(), get().fetchLocations(), get().fetchCategories()]);
  },

  clear: () =>
    set({
      services: [],
      locations: [],
      categories: [],

      loadingServices: false,
      loadingLocations: false,
      loadingCategories: false,
    }),
}));

const duplicateData = <T extends { id: any }>(data: T[], times: number): T[] => {
  return Array(times)
    .fill(null)
    .flatMap((_, i) =>
      data.map((item) => ({
        ...item,
        id: `${item.id}-${i}`,
      })),
    );
};

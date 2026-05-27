import { apiClient } from "./client";
import type { Theme } from "@/types";

export const themesApi = {
  list: async (filters?: { eventType?: string; isPremium?: boolean; tag?: string }): Promise<Theme[]> => {
    const { data } = await apiClient.get("/themes", { params: filters });
    return data;
  },
  getById: async (id: string): Promise<Theme> => {
    const { data } = await apiClient.get(`/themes/${id}`);
    return data;
  },
};

import { apiClient } from "./client";
import type { Invitation, InvitationCreateInput } from "@/types";

export const invitationsApi = {
  list: async (): Promise<Invitation[]> => {
    const { data } = await apiClient.get("/invitations");
    return data;
  },
  getById: async (id: string): Promise<Invitation> => {
    const { data } = await apiClient.get(`/invitations/${id}`);
    return data;
  },
  getBySlug: async (slug: string): Promise<Invitation> => {
    const { data } = await apiClient.get(`/invitations/slug/${slug}`);
    return data;
  },
  create: async (input: InvitationCreateInput): Promise<Invitation> => {
    const { data } = await apiClient.post("/invitations", input);
    return data;
  },
  update: async (id: string, updates: Partial<Invitation>): Promise<Invitation> => {
    const { data } = await apiClient.patch(`/invitations/${id}`, updates);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/invitations/${id}`);
  },
  duplicate: async (id: string): Promise<Invitation> => {
    const { data } = await apiClient.post(`/invitations/${id}/duplicate`);
    return data;
  },
  publish: async (id: string): Promise<Invitation> => {
    const { data } = await apiClient.post(`/invitations/${id}/publish`);
    return data;
  },
};

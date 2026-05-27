import { apiClient } from "./client";
import type { RSVP, RSVPStats, RSVPSubmitInput } from "@/types";

export const rsvpApi = {
  list: async (invitationId: string): Promise<RSVP[]> => {
    const { data } = await apiClient.get(`/rsvp/${invitationId}`);
    return data;
  },
  getStats: async (invitationId: string): Promise<RSVPStats> => {
    const { data } = await apiClient.get(`/rsvp/${invitationId}/stats`);
    return data;
  },
  submit: async (input: RSVPSubmitInput): Promise<RSVP> => {
    const { data } = await apiClient.post(`/rsvp/${input.invitationId}`, input);
    return data;
  },
};

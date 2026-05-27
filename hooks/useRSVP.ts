import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rsvpApi } from "@/lib/api/rsvp";
import type { RSVPSubmitInput } from "@/types";

export function useRSVPStats(invitationId: string) {
  return useQuery({ queryKey: ["rsvp","stats",invitationId], queryFn: () => rsvpApi.getStats(invitationId), enabled: !!invitationId });
}

export function useRSVPList(invitationId: string) {
  return useQuery({ queryKey: ["rsvp","list",invitationId], queryFn: () => rsvpApi.list(invitationId), enabled: !!invitationId });
}

export function useSubmitRSVP() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RSVPSubmitInput) => rsvpApi.submit(input),
    onSuccess: (_, variables) => qc.invalidateQueries({ queryKey: ["rsvp","stats",variables.invitationId] }),
  });
}

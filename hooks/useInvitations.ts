import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationsApi } from "@/lib/api/invitations";
import { useUIStore } from "@/stores/useUIStore";
import type { Invitation, InvitationCreateInput } from "@/types";

export function useInvitations() {
  return useQuery({ queryKey: ["invitations"], queryFn: invitationsApi.list });
}

export function useInvitation(id: string) {
  return useQuery({ queryKey: ["invitations", id], queryFn: () => invitationsApi.getById(id), enabled: !!id });
}

export function useInvitationBySlug(slug: string) {
  return useQuery({ queryKey: ["invitations", "slug", slug], queryFn: () => invitationsApi.getBySlug(slug), enabled: !!slug });
}

export function useCreateInvitation() {
  const qc = useQueryClient();
  const { addToast } = useUIStore();
  return useMutation({
    mutationFn: (input: InvitationCreateInput) => invitationsApi.create(input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invitations"] }); addToast({ type: "success", message: "Invitation created" }); },
    onError: () => addToast({ type: "error", message: "Failed to create invitation" }),
  });
}

export function useUpdateInvitation(id: string) {
  const qc = useQueryClient();
  const { addToast } = useUIStore();
  return useMutation({
    mutationFn: (updates: Partial<Invitation>) => invitationsApi.update(id, updates),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invitations", id] }); addToast({ type: "success", message: "Changes saved" }); },
    onError: () => addToast({ type: "error", message: "Failed to save changes" }),
  });
}

export function useDeleteInvitation() {
  const qc = useQueryClient();
  const { addToast, closeModal } = useUIStore();
  return useMutation({
    mutationFn: (id: string) => invitationsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invitations"] }); closeModal(); addToast({ type: "success", message: "Invitation deleted" }); },
  });
}

export function useDuplicateInvitation() {
  const qc = useQueryClient();
  const { addToast } = useUIStore();
  return useMutation({
    mutationFn: (id: string) => invitationsApi.duplicate(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invitations"] }); addToast({ type: "success", message: "Invitation duplicated" }); },
  });
}

export function usePublishInvitation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => invitationsApi.publish(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invitations", id] }),
  });
}

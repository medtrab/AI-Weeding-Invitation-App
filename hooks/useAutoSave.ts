import { useEffect, useRef } from "react";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { useUpdateInvitation } from "./useInvitations";

const AUTOSAVE_DELAY = 3000;

export function useAutoSave(invitationId: string) {
  const { invitation, isDirty, setIsSaving, markClean } = useInvitationStore();
  const { mutateAsync: update } = useUpdateInvitation(invitationId);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (!isDirty || !invitation) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setIsSaving(true);
      try { await update(invitation); markClean(); }
      finally { setIsSaving(false); }
    }, AUTOSAVE_DELAY);
    return () => clearTimeout(timerRef.current);
  }, [isDirty, invitation, update, setIsSaving, markClean]);
}

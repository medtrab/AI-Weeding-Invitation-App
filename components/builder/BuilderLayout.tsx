"use client";
import { useEffect } from "react";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { useAutoSave } from "@/hooks/useAutoSave";
import { BuilderToolbar } from "./BuilderToolbar";
import { BuilderSidebar } from "./BuilderSidebar";
import { BuilderCanvas } from "./BuilderCanvas";
import { BuilderPropertiesPanel } from "./BuilderPropertiesPanel";
import { ToastContainer } from "@/components/ui/Toast";
import type { Invitation } from "@/types";

export function BuilderLayout({ invitation }: { invitation: Invitation }) {
  const { setInvitation } = useInvitationStore();
  useAutoSave(invitation.id);
  useEffect(() => { setInvitation(invitation); }, [invitation.id]);

  return (
    <div className="fixed inset-0 flex flex-col bg-[#0A0806] overflow-hidden">
      <BuilderToolbar />
      <div className="flex flex-1 overflow-hidden">
        <BuilderSidebar />
        <BuilderCanvas />
        <BuilderPropertiesPanel />
      </div>
      <ToastContainer />
    </div>
  );
}

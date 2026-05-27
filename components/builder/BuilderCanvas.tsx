"use client";
import { motion } from "framer-motion";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";

export function BuilderCanvas() {
  const { invitation, previewMode } = useInvitationStore();
  if (!invitation) return (
    <div className="flex-1 flex items-center justify-center bg-[#080604]">
      <p className="text-cream/20 text-sm">Loading...</p>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#080604] flex items-start justify-center p-8">
      <motion.div
        className="origin-top w-full"
        animate={{ maxWidth: previewMode === "mobile" ? 390 : 1200 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className={`${previewMode === "mobile" ? "border border-gold/20 shadow-2xl mx-auto" : ""} overflow-hidden`}
          style={{ maxWidth: previewMode === "mobile" ? 390 : "100%" }}>
          <InvitationRenderer invitation={invitation} isPreview />
        </div>
      </motion.div>
    </div>
  );
}

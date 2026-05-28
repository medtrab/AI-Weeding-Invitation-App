"use client";
import { motion } from "framer-motion";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { GeneratedInvitation } from "@/components/invitation/generated/GeneratedInvitation";

export function BuilderCanvas() {
  const { invitation, previewMode } = useInvitationStore();

  if (!invitation) return (
    <div className="flex-1 flex items-center justify-center bg-[#080604]">
      <p className="text-cream/20 text-sm">Loading…</p>
    </div>
  );

  const hasGeneratedHtml = !!(invitation as { generatedHtml?: string }).generatedHtml;
  const generatedHtml    = (invitation as { generatedHtml?: string }).generatedHtml;

  return (
    <div className="flex-1 overflow-y-auto bg-[#080604] flex items-start justify-center p-8">
      <motion.div
        className="origin-top w-full"
        animate={{ maxWidth: previewMode === "mobile" ? 390 : 1200 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div
          className={`overflow-hidden ${previewMode === "mobile" ? "border border-gold/20 shadow-2xl mx-auto" : ""}`}
          style={{ maxWidth: previewMode === "mobile" ? 390 : "100%" }}
        >
          {hasGeneratedHtml && generatedHtml ? (
            <GeneratedInvitation html={generatedHtml} />
          ) : (
            <InvitationRenderer invitation={invitation} isPreview />
          )}
        </div>
      </motion.div>
    </div>
  );
}

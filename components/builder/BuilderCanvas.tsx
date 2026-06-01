"use client";
import { motion } from "framer-motion";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { InvitationRenderer }  from "@/components/invitation/InvitationRenderer";
import { SpecRenderer }        from "@/components/invitation/generated/SpecRenderer";
import { CinematicTemplate }   from "@/components/invitation/templates/CinematicTemplate";

export function BuilderCanvas() {
  const { invitation, previewMode } = useInvitationStore();

  if (!invitation) return (
    <div className="flex-1 flex items-center justify-center bg-[#080604]">
      <p className="text-cream/20 text-sm">Loading…</p>
    </div>
  );

  // Parse generatedHtml to determine which renderer to use
  let cinematic: { pollinationsUrl?: string; imageData?: string; spec?: unknown; photos?: string[] } | null = null;
  let specData:  { spec: unknown; photos: string[] } | null = null;

  try {
    const raw = (invitation as { generatedHtml?: string }).generatedHtml;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.__cinematic) cinematic = parsed;
      else if (parsed.__spec)  specData  = parsed;
    }
  } catch {}

  const bgImageUrl = cinematic?.imageData || cinematic?.pollinationsUrl || undefined;

  return (
    <div className="flex-1 overflow-y-auto bg-[#080604] flex items-start justify-center p-4 sm:p-8">
      <motion.div className="origin-top w-full"
        animate={{ maxWidth: previewMode === "mobile" ? 390 : 1200 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}>
        <div className={`overflow-hidden ${previewMode === "mobile" ? "border border-gold/20 shadow-2xl mx-auto" : ""}`}
          style={{ maxWidth: previewMode === "mobile" ? 390 : "100%" }}>

          {cinematic ? (
            // Cinematic template — same as public page
            <div style={{ minHeight: previewMode === "mobile" ? 844 : 600, position: "relative" }}>
              <CinematicTemplate
                invitation={invitation}
                imageUrl={bgImageUrl}
                isPreview
              />
            </div>
          ) : specData ? (
            <SpecRenderer
              spec={specData.spec as never}
              coupleName={invitation.coupleName ?? invitation.title}
              eventDate={invitation.eventDate}
              venue={invitation.venue}
              photos={specData.photos ?? []}
              isPreview
            />
          ) : (
            <InvitationRenderer invitation={invitation} isPreview />
          )}
        </div>
      </motion.div>
    </div>
  );
}

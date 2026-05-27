"use client";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { SUPPORTED_FONTS } from "@/config/defaults";

export function TypographyEditor() {
  const { invitation, updateField } = useInvitationStore();
  if (!invitation) return null;
  const serifs = SUPPORTED_FONTS.filter((f) => f.category === "serif");
  const sans   = SUPPORTED_FONTS.filter((f) => f.category === "sans");
  return (
    <div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40 block mb-3">Typography</span>
      <div className="space-y-3">
        <div>
          <label className="text-[10px] text-cream/30 block mb-1">Heading font</label>
          <select value={invitation.fontPrimary} onChange={(e) => updateField("fontPrimary", e.target.value)}
            className="w-full bg-[#1A1608] border border-gold/15 text-cream text-xs px-3 py-2 outline-none cursor-pointer">
            {serifs.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-cream/30 block mb-1">Body font</label>
          <select value={invitation.fontSecondary} onChange={(e) => updateField("fontSecondary", e.target.value)}
            className="w-full bg-[#1A1608] border border-gold/15 text-cream text-xs px-3 py-2 outline-none cursor-pointer">
            {sans.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

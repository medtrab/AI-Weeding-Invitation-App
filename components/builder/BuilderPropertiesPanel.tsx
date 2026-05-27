"use client";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { ColorPaletteEditor } from "./properties/ColorPaletteEditor";
import { TypographyEditor }   from "./properties/TypographyEditor";
import { AnimationPicker }    from "./properties/AnimationPicker";
import { MusicPicker }        from "./properties/MusicPicker";
import { SectionEditor }      from "./properties/SectionEditor";

export function BuilderPropertiesPanel() {
  const { invitation, selectedSectionId } = useInvitationStore();
  if (!invitation) return null;
  const selected = invitation.sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="w-72 border-l border-gold/10 bg-[#0D0B08] overflow-y-auto">
      <div className="p-4 border-b border-gold/10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60">
          {selected ? `Edit: ${selected.type}` : "Design"}
        </span>
      </div>
      <div className="p-4 space-y-6">
        {selected ? (
          <SectionEditor section={selected} />
        ) : (
          <>
            <ColorPaletteEditor />
            <div className="h-px bg-gold/10" />
            <TypographyEditor />
            <div className="h-px bg-gold/10" />
            <AnimationPicker />
            <div className="h-px bg-gold/10" />
            <MusicPicker />
          </>
        )}
      </div>
    </div>
  );
}

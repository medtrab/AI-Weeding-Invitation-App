"use client";
import { useState } from "react";
import { Wand2, Palette, Image } from "lucide-react";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { ColorPaletteEditor } from "./properties/ColorPaletteEditor";
import { TypographyEditor }   from "./properties/TypographyEditor";
import { AnimationPicker }    from "./properties/AnimationPicker";
import { MusicPicker }        from "./properties/MusicPicker";
import { SectionEditor }      from "./properties/SectionEditor";
import { PhotoUploader }      from "./properties/PhotoUploader";
import { VibeGenerator }      from "@/components/dashboard/VibeGenerator";

type Tab = "design" | "photos" | "vibe";

export function BuilderPropertiesPanel() {
  const { invitation, selectedSectionId, updateField, setColorPalette } = useInvitationStore();
  const [tab, setTab] = useState<Tab>("design");

  if (!invitation) return null;
  const selected = invitation.sections.find((s) => s.id === selectedSectionId);

  const applyTheme = (theme: {
    colorPalette: { primary: string; secondary: string; accent: string; background: string; text: string };
    fontPrimary: string;
    fontSecondary: string;
    animationStyle: string;
    musicSuggestion: string;
  }) => {
    setColorPalette(theme.colorPalette);
    updateField("fontPrimary",    theme.fontPrimary);
    updateField("fontSecondary",  theme.fontSecondary);
    updateField("animationStyle", theme.animationStyle as never);
    updateField("musicLabel",     theme.musicSuggestion);
  };

  const TABS = [
    { id: "design" as Tab, icon: Palette, label: "Design"  },
    { id: "photos" as Tab, icon: Image,   label: "Photos"  },
    { id: "vibe"   as Tab, icon: Wand2,   label: "AI"      },
  ];

  return (
    <div className="w-80 border-l border-gold/10 bg-[#0D0B08] flex flex-col">
      {/* Tab bar — only when no section selected */}
      {!selected && (
        <div className="flex border-b border-gold/10">
          {TABS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] uppercase tracking-[0.12em] transition-colors border-b-2 ${
                tab === id
                  ? "text-gold border-gold"
                  : "text-cream/30 border-transparent hover:text-cream/60"
              }`}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="p-4 border-b border-gold/10">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60">
            Edit: {selected.type}
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {selected ? (
          <SectionEditor section={selected} />
        ) : tab === "design" ? (
          <div className="space-y-6">
            <ColorPaletteEditor />
            <div className="h-px bg-gold/10" />
            <TypographyEditor />
            <div className="h-px bg-gold/10" />
            <AnimationPicker />
            <div className="h-px bg-gold/10" />
            <MusicPicker />
          </div>
        ) : tab === "photos" ? (
          <PhotoUploader />
        ) : (
          <VibeGenerator invitationId={invitation.id} onApplyTheme={applyTheme} />
        )}
      </div>
    </div>
  );
}

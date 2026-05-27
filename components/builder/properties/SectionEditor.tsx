"use client";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { Trash2 } from "lucide-react";
import type { InvitationSection } from "@/types";

interface SectionEditorProps { section: InvitationSection; }

export function SectionEditor({ section }: SectionEditorProps) {
  const { updateSection, removeSection, setSelectedSection } = useInvitationStore();
  const update = (key: string, value: unknown) =>
    updateSection(section.id, { content: { ...section.content, [key]: value } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold">{section.type} settings</span>
        <button onClick={() => { removeSection(section.id); setSelectedSection(null); }} className="text-red-400/50 hover:text-red-400">
          <Trash2 size={13} />
        </button>
      </div>
      {section.type === "hero" && (
        <div>
          <label className="text-[10px] text-cream/30 block mb-1">Eyebrow text</label>
          <input type="text" value={(section.content.eyebrow as string) ?? ""}
            onChange={(e) => update("eyebrow", e.target.value)}
            className="w-full bg-[#1A1608] border border-gold/15 text-cream text-xs px-3 py-2 outline-none"
            placeholder="✦ — You're Invited — ✦"
          />
        </div>
      )}
      {section.type === "details" && (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-cream/30 block mb-1">Dress code</label>
            <input type="text" value={(section.content.dressCode as string) ?? ""}
              onChange={(e) => update("dressCode", e.target.value)}
              className="w-full bg-[#1A1608] border border-gold/15 text-cream text-xs px-3 py-2 outline-none"
              placeholder="Black tie optional"
            />
          </div>
          <div>
            <label className="text-[10px] text-cream/30 block mb-1">Additional note</label>
            <textarea value={(section.content.note as string) ?? ""}
              onChange={(e) => update("note", e.target.value)} rows={3}
              className="w-full bg-[#1A1608] border border-gold/15 text-cream text-xs px-3 py-2 outline-none resize-none"
              placeholder="Parking available on-site..."
            />
          </div>
        </div>
      )}
      {!["hero","details"].includes(section.type) && (
        <p className="text-xs text-cream/30 italic">Click elements in the preview to edit them directly.</p>
      )}
    </div>
  );
}

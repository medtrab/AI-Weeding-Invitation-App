"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff } from "lucide-react";
import { useInvitationStore } from "@/stores/useInvitationStore";
import type { InvitationSection } from "@/types";

const SECTION_LABELS: Record<string, string> = {
  hero:"Hero", details:"Event Details", countdown:"Countdown",
  gallery:"Photo Gallery", rsvp:"RSVP Form", map:"Map & Venue", message:"Guest Message",
};
const SECTION_ICONS: Record<string, string> = {
  hero:"🎴", details:"📍", countdown:"⏳", gallery:"🖼️", rsvp:"✉️", map:"🗺️", message:"💬",
};

interface SortableSectionItemProps {
  section: InvitationSection; isSelected: boolean; onSelect: () => void;
}

export function SortableSectionItem({ section, isSelected, onSelect }: SortableSectionItemProps) {
  const { toggleSection } = useInvitationStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      onClick={onSelect}
      className={`flex items-center gap-2 px-3 py-2.5 mb-0.5 cursor-pointer transition-all ${
        isSelected ? "bg-gold/10 border-l-2 border-gold" : "hover:bg-cream/5 border-l-2 border-transparent"
      } ${!section.visible ? "opacity-40" : ""}`}
    >
      <button {...attributes} {...listeners} onClick={(e) => e.stopPropagation()} className="text-cream/20 hover:text-cream/50 cursor-grab active:cursor-grabbing">
        <GripVertical size={13} />
      </button>
      <span className="text-sm">{SECTION_ICONS[section.type] ?? "◈"}</span>
      <span className={`flex-1 text-xs tracking-wide ${isSelected ? "text-gold" : "text-cream/55"}`}>
        {SECTION_LABELS[section.type] ?? section.type}
      </span>
      <button onClick={(e) => { e.stopPropagation(); toggleSection(section.id); }} className="text-cream/25 hover:text-cream/60 transition-colors">
        {section.visible ? <Eye size={12} /> : <EyeOff size={12} />}
      </button>
    </div>
  );
}

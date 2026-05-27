"use client";
import { useState } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { SortableSectionItem } from "./SortableSectionItem";
import type { InvitationSection } from "@/types";

const ADD_OPTIONS: { type: InvitationSection["type"]; label: string; icon: string }[] = [
  { type:"hero",      label:"Hero",          icon:"🎴" },
  { type:"details",   label:"Event Details", icon:"📍" },
  { type:"countdown", label:"Countdown",     icon:"⏳" },
  { type:"gallery",   label:"Photo Gallery", icon:"🖼️" },
  { type:"rsvp",      label:"RSVP Form",     icon:"✉️" },
  { type:"map",       label:"Map & Venue",   icon:"🗺️" },
  { type:"message",   label:"Guest Message", icon:"💬" },
];

export function BuilderSidebar() {
  const { invitation, reorderSections, addSection, setSelectedSection, selectedSectionId } = useInvitationStore();
  const [showAdd, setShowAdd] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id || !invitation) return;
    const secs   = invitation.sections;
    const oldIdx = secs.findIndex((s) => s.id === active.id);
    const newIdx = secs.findIndex((s) => s.id === over.id);
    reorderSections(arrayMove(secs, oldIdx, newIdx));
  };

  if (!invitation) return null;
  const sorted = [...invitation.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="w-56 border-r border-gold/10 flex flex-col bg-[#0D0B08]">
      <div className="p-4 border-b border-gold/10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60">Sections</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {sorted.map((section) => (
              <SortableSectionItem
                key={section.id}
                section={section}
                isSelected={selectedSectionId === section.id}
                onSelect={() => setSelectedSection(section.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <div className="p-3 border-t border-gold/10 relative">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-full flex items-center justify-center gap-2 py-2 text-[11px] uppercase tracking-[0.15em] text-gold/60 hover:text-gold border border-gold/15 hover:border-gold/40 transition-all"
        >
          <Plus size={13} /> Add Section
        </button>
        {showAdd && (
          <div className="absolute bottom-full left-2 right-2 mb-1 bg-[#1A1610] border border-gold/20 z-10">
            {ADD_OPTIONS.map((opt) => (
              <button key={opt.type} onClick={() => { addSection(opt.type); setShowAdd(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-cream/60 hover:text-cream hover:bg-gold/5 transition-colors text-left">
                <span>{opt.icon}</span>{opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

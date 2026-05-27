// components/builder/BuilderLayout.tsx
// Main layout: left sidebar + center canvas + right panel

"use client";

import { useEffect } from "react";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { useAutoSave } from "@/hooks/useAutoSave";
import { BuilderToolbar } from "./BuilderToolbar";
import { BuilderSidebar } from "./BuilderSidebar";
import { BuilderCanvas } from "./BuilderCanvas";
import { BuilderPropertiesPanel } from "./BuilderPropertiesPanel";
import type { Invitation } from "@/types";

interface BuilderLayoutProps {
  invitation: Invitation;
}

export function BuilderLayout({ invitation }: BuilderLayoutProps) {
  const { setInvitation } = useInvitationStore();
  useAutoSave(invitation.id);

  useEffect(() => {
    setInvitation(invitation);
  }, [invitation.id]);

  return (
    <div className="fixed inset-0 flex flex-col bg-[#0A0806] overflow-hidden">
      <BuilderToolbar />
      <div className="flex flex-1 overflow-hidden">
        <BuilderSidebar />
        <BuilderCanvas />
        <BuilderPropertiesPanel />
      </div>
    </div>
  );
}


// components/builder/BuilderToolbar.tsx

"use client";

import { ArrowLeft, Undo, Redo, Eye, Share2, Smartphone, Monitor } from "lucide-react";
import Link from "next/link";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { Button } from "@/components/ui/Button";
import { usePublishInvitation } from "@/hooks/useInvitations";

export function BuilderToolbar() {
  const {
    invitation,
    isDirty,
    isSaving,
    previewMode,
    setPreviewMode,
    undo,
    redo,
    history,
  } = useInvitationStore();

  const { mutate: publish, isPending: isPublishing } = usePublishInvitation(
    invitation?.id ?? ""
  );

  return (
    <div className="h-14 flex items-center px-4 border-b border-gold/10 bg-[#0D0B08] z-20">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-cream/40 hover:text-cream/80 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <span className="text-sm text-cream/60 font-light tracking-wide">
          {invitation?.title ?? "Untitled Invitation"}
        </span>
        {isSaving && (
          <span className="text-[10px] uppercase tracking-[0.15em] text-gold/60 animate-pulse">
            Saving...
          </span>
        )}
        {isDirty && !isSaving && (
          <span className="text-[10px] uppercase tracking-[0.15em] text-cream/25">
            Unsaved
          </span>
        )}
      </div>

      {/* Center — preview toggle */}
      <div className="flex-1 flex justify-center">
        <div className="flex border border-gold/15">
          <button
            onClick={() => setPreviewMode("mobile")}
            className={`px-3 py-1.5 transition-colors ${
              previewMode === "mobile"
                ? "bg-gold/10 text-gold"
                : "text-cream/30 hover:text-cream/60"
            }`}
          >
            <Smartphone size={15} />
          </button>
          <button
            onClick={() => setPreviewMode("desktop")}
            className={`px-3 py-1.5 transition-colors ${
              previewMode === "desktop"
                ? "bg-gold/10 text-gold"
                : "text-cream/30 hover:text-cream/60"
            }`}
          >
            <Monitor size={15} />
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={history.past.length === 0}
          className="p-2 text-cream/30 hover:text-cream/70 disabled:opacity-20 transition-colors"
        >
          <Undo size={15} />
        </button>
        <button
          onClick={redo}
          disabled={history.future.length === 0}
          className="p-2 text-cream/30 hover:text-cream/70 disabled:opacity-20 transition-colors"
        >
          <Redo size={15} />
        </button>
        <Button variant="ghost" size="sm">
          <Eye size={14} /> Preview
        </Button>
        <Button
          size="sm"
          onClick={() => publish()}
          isLoading={isPublishing}
        >
          Publish
        </Button>
      </div>
    </div>
  );
}


// components/builder/BuilderSidebar.tsx
// Left sidebar: section list + add section

"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { SortableSectionItem } from "./SortableSectionItem";
import { Plus } from "lucide-react";
import type { InvitationSection } from "@/types";

const SECTION_OPTIONS: { type: InvitationSection["type"]; label: string; icon: string }[] = [
  { type: "hero", label: "Hero", icon: "🎴" },
  { type: "details", label: "Event Details", icon: "📍" },
  { type: "countdown", label: "Countdown", icon: "⏳" },
  { type: "gallery", label: "Photo Gallery", icon: "🖼️" },
  { type: "rsvp", label: "RSVP Form", icon: "✉️" },
  { type: "map", label: "Map & Venue", icon: "🗺️" },
  { type: "message", label: "Guest Message", icon: "💬" },
];

export function BuilderSidebar() {
  const { invitation, reorderSections, addSection, setSelectedSection, selectedSectionId } =
    useInvitationStore();
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !invitation) return;
    const sections = invitation.sections;
    const oldIdx = sections.findIndex((s) => s.id === active.id);
    const newIdx = sections.findIndex((s) => s.id === over.id);
    reorderSections(arrayMove(sections, oldIdx, newIdx));
  };

  if (!invitation) return null;

  const sorted = [...invitation.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="w-56 border-r border-gold/10 flex flex-col bg-[#0D0B08] overflow-hidden">
      <div className="p-4 border-b border-gold/10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/70">Sections</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sorted.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
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

      {/* Add section */}
      <div className="p-3 border-t border-gold/10 relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs uppercase tracking-[0.15em] text-gold/60 hover:text-gold border border-gold/15 hover:border-gold/40 transition-all"
        >
          <Plus size={13} />
          Add Section
        </button>

        {showAddMenu && (
          <div className="absolute bottom-full left-2 right-2 mb-1 bg-[#1A1610] border border-gold/20 z-10">
            {SECTION_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => {
                  addSection(opt.type);
                  setShowAddMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-cream/60 hover:text-cream hover:bg-gold/5 transition-colors text-left"
              >
                <span>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// components/builder/BuilderCanvas.tsx
// Center preview canvas

"use client";

import { motion } from "framer-motion";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";

export function BuilderCanvas() {
  const { invitation, previewMode } = useInvitationStore();

  if (!invitation) return null;

  return (
    <div className="flex-1 overflow-y-auto flex items-start justify-center bg-[#080604] p-8">
      <motion.div
        className="origin-top"
        animate={{
          width: previewMode === "mobile" ? 390 : "100%",
          maxWidth: previewMode === "mobile" ? 390 : 1280,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Device frame for mobile */}
        {previewMode === "mobile" ? (
          <div className="border border-gold/20 rounded-[3px] overflow-hidden shadow-2xl">
            <InvitationRenderer invitation={invitation} isPreview />
          </div>
        ) : (
          <InvitationRenderer invitation={invitation} isPreview />
        )}
      </motion.div>
    </div>
  );
}


// components/builder/BuilderPropertiesPanel.tsx
// Right panel: context-sensitive properties editor

"use client";

import { useInvitationStore } from "@/stores/useInvitationStore";
import { ColorPaletteEditor } from "./properties/ColorPaletteEditor";
import { TypographyEditor } from "./properties/TypographyEditor";
import { AnimationPicker } from "./properties/AnimationPicker";
import { MusicPicker } from "./properties/MusicPicker";
import { SectionEditor } from "./properties/SectionEditor";

export function BuilderPropertiesPanel() {
  const { invitation, selectedSectionId } = useInvitationStore();

  if (!invitation) return null;

  const selectedSection = invitation.sections.find(
    (s) => s.id === selectedSectionId
  );

  return (
    <div className="w-72 border-l border-gold/10 bg-[#0D0B08] overflow-y-auto">
      <div className="p-4 border-b border-gold/10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/70">
          {selectedSection ? `Edit: ${selectedSection.type}` : "Design"}
        </span>
      </div>

      <div className="p-4 space-y-6">
        {selectedSection ? (
          <SectionEditor section={selectedSection} />
        ) : (
          <>
            <ColorPaletteEditor />
            <TypographyEditor />
            <AnimationPicker />
            <MusicPicker />
          </>
        )}
      </div>
    </div>
  );
}


// components/builder/properties/ColorPaletteEditor.tsx

"use client";

import { useInvitationStore } from "@/stores/useInvitationStore";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import { Input } from "@/components/ui/Input";

const PRESET_PALETTES = [
  { primary: "#C9A84C", secondary: "#1A0E0A", accent: "#8B2020", background: "#0D0B08", text: "#F5E4B0" },
  { primary: "#7A9ACC", secondary: "#0F1520", accent: "#4A7ACC", background: "#08101A", text: "#E8F0FA" },
  { primary: "#4A9468", secondary: "#060A08", accent: "#80C4A0", background: "#0C1510", text: "#E8F5EE" },
  { primary: "#CC6666", secondary: "#1A0808", accent: "#E8A0A0", background: "#0D0808", text: "#FAE8E8" },
];

export function ColorPaletteEditor() {
  const { invitation, setColorPalette } = useInvitationStore();
  if (!invitation) return null;

  return (
    <div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40 block mb-3">
        Color Palette
      </span>

      {/* Presets */}
      <div className="flex gap-2 mb-4">
        {PRESET_PALETTES.map((palette, i) => (
          <button
            key={i}
            onClick={() => setColorPalette(palette)}
            className="w-8 h-8 rounded-full transition-all hover:scale-110 ring-offset-deep ring-offset-2 hover:ring-2 hover:ring-gold/50"
            style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.background})` }}
          />
        ))}
      </div>

      {/* Custom */}
      <div className="space-y-2">
        {Object.entries(invitation.colorPalette).map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <input
              type="color"
              value={value}
              onChange={(e) =>
                setColorPalette({ ...invitation.colorPalette, [key]: e.target.value })
              }
              className="w-8 h-8 cursor-pointer border border-gold/20 bg-transparent p-0.5"
            />
            <span className="text-xs text-cream/50 capitalize tracking-wide flex-1">{key}</span>
            <span className="text-[10px] text-cream/25 font-mono">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

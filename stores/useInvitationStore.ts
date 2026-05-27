import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import type { Invitation, InvitationSection, ColorPalette } from "@/types";

interface BuilderHistory {
  past: Partial<Invitation>[];
  future: Partial<Invitation>[];
}

interface InvitationStore {
  invitation: Invitation | null;
  isDirty: boolean;
  isSaving: boolean;
  selectedSectionId: string | null;
  previewMode: "desktop" | "mobile";
  history: BuilderHistory;
  setInvitation: (invitation: Invitation) => void;
  updateField: <K extends keyof Invitation>(field: K, value: Invitation[K]) => void;
  updateSection: (sectionId: string, content: Partial<InvitationSection>) => void;
  reorderSections: (sections: InvitationSection[]) => void;
  toggleSection: (sectionId: string) => void;
  addSection: (type: InvitationSection["type"]) => void;
  removeSection: (sectionId: string) => void;
  setColorPalette: (palette: ColorPalette) => void;
  setSelectedSection: (id: string | null) => void;
  setPreviewMode: (mode: "desktop" | "mobile") => void;
  setIsSaving: (saving: boolean) => void;
  markClean: () => void;
  undo: () => void;
  redo: () => void;
}

export const useInvitationStore = create<InvitationStore>()(
  devtools(
    immer((set) => ({
      invitation: null,
      isDirty: false,
      isSaving: false,
      selectedSectionId: null,
      previewMode: "mobile",
      history: { past: [], future: [] },

      setInvitation: (invitation) => set((state) => {
        state.invitation = invitation;
        state.isDirty = false;
        state.history = { past: [], future: [] };
      }),

      updateField: (field, value) => set((state) => {
        if (!state.invitation) return;
        state.history.past.push({ [field]: state.invitation[field] } as Partial<Invitation>);
        state.history.future = [];
        (state.invitation as Record<string, unknown>)[field as string] = value;
        state.isDirty = true;
      }),

      updateSection: (sectionId, content) => set((state) => {
        if (!state.invitation) return;
        const idx = state.invitation.sections.findIndex((s) => s.id === sectionId);
        if (idx !== -1) { Object.assign(state.invitation.sections[idx], content); state.isDirty = true; }
      }),

      reorderSections: (sections) => set((state) => {
        if (!state.invitation) return;
        state.invitation.sections = sections; state.isDirty = true;
      }),

      toggleSection: (sectionId) => set((state) => {
        if (!state.invitation) return;
        const s = state.invitation.sections.find((s) => s.id === sectionId);
        if (s) { s.visible = !s.visible; state.isDirty = true; }
      }),

      addSection: (type) => set((state) => {
        if (!state.invitation) return;
        state.invitation.sections.push({
          id: `section_${Date.now()}`, type, order: state.invitation.sections.length,
          visible: true, content: {},
        });
        state.isDirty = true;
      }),

      removeSection: (sectionId) => set((state) => {
        if (!state.invitation) return;
        state.invitation.sections = state.invitation.sections.filter((s) => s.id !== sectionId);
        state.isDirty = true;
      }),

      setColorPalette: (palette) => set((state) => {
        if (!state.invitation) return;
        state.invitation.colorPalette = palette; state.isDirty = true;
      }),

      setSelectedSection: (id) => set((state) => { state.selectedSectionId = id; }),
      setPreviewMode:     (mode) => set((state) => { state.previewMode = mode; }),
      setIsSaving:        (saving) => set((state) => { state.isSaving = saving; }),
      markClean:          () => set((state) => { state.isDirty = false; }),

      undo: () => set((state) => {
        if (!state.invitation || state.history.past.length === 0) return;
        const previous = state.history.past.pop()!;
        state.history.future.unshift(
          Object.fromEntries(Object.keys(previous).map((k) => [k, (state.invitation as Record<string, unknown>)[k]])) as Partial<Invitation>
        );
        Object.assign(state.invitation, previous); state.isDirty = true;
      }),

      redo: () => set((state) => {
        if (!state.invitation || state.history.future.length === 0) return;
        const next = state.history.future.shift()!;
        state.history.past.push(
          Object.fromEntries(Object.keys(next).map((k) => [k, (state.invitation as Record<string, unknown>)[k]])) as Partial<Invitation>
        );
        Object.assign(state.invitation, next); state.isDirty = true;
      }),
    })),
    { name: "invitation-builder" }
  )
);

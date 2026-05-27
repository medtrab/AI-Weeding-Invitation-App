import { create } from "zustand";

type ModalType = "auth" | "rsvp" | "share" | "delete_invitation" | "upgrade_plan" | "music_picker" | null;

interface Toast { id: string; type: "success" | "error" | "info"; message: string; }

interface UIStore {
  activeModal: ModalType;
  modalData: Record<string, unknown>;
  toasts: Toast[];
  isNavOpen: boolean;
  openModal: (type: ModalType, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  toggleNav: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeModal: null, modalData: {}, toasts: [], isNavOpen: false,
  openModal: (type, data = {}) => set({ activeModal: type, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: {} }),
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: `toast_${Date.now()}` }],
  })),
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
}));

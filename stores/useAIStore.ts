import { create } from "zustand";
import type { AIGenerationResult } from "@/types";

type AIStatus = "idle" | "analyzing" | "generating_palette" | "crafting_text" | "selecting_animations" | "finalizing" | "done" | "error";

const STATUS_PROGRESS: Record<AIStatus, number> = {
  idle: 0, analyzing: 15, generating_palette: 35, crafting_text: 55,
  selecting_animations: 75, finalizing: 90, done: 100, error: 0,
};

interface AIStore {
  status: AIStatus;
  progress: number;
  result: AIGenerationResult | null;
  error: string | null;
  currentPrompt: string;
  setStatus: (status: AIStatus) => void;
  setProgress: (progress: number) => void;
  setResult: (result: AIGenerationResult) => void;
  setError: (error: string) => void;
  setPrompt: (prompt: string) => void;
  reset: () => void;
}

export const useAIStore = create<AIStore>((set) => ({
  status: "idle", progress: 0, result: null, error: null, currentPrompt: "",
  setStatus: (status) => set({ status, progress: STATUS_PROGRESS[status] }),
  setProgress: (progress) => set({ progress }),
  setResult: (result) => set({ result, status: "done", progress: 100 }),
  setError: (error) => set({ error, status: "error" }),
  setPrompt: (prompt) => set({ currentPrompt: prompt }),
  reset: () => set({ status: "idle", progress: 0, result: null, error: null }),
}));

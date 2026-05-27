import { useCallback } from "react";
import { useAIStore } from "@/stores/useAIStore";
import { aiApi } from "@/lib/api/ai";
import type { AIGenerationInput, AITextGenerationInput } from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useAIGeneration() {
  const { setStatus, setResult, setError, reset } = useAIStore();
  const generate = useCallback(async (input: AIGenerationInput) => {
    reset();
    try {
      setStatus("analyzing");       await delay(600);
      setStatus("generating_palette"); await delay(500);
      setStatus("crafting_text");   await delay(600);
      setStatus("selecting_animations"); await delay(500);
      setStatus("finalizing");
      const result = await aiApi.generate(input);
      setResult(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      throw err;
    }
  }, [setStatus, setResult, setError, reset]);
  return { generate };
}

export function useAITextGeneration() {
  return useCallback((input: AITextGenerationInput) => aiApi.generateText(input), []);
}

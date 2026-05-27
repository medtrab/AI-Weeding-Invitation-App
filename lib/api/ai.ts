import { apiClient } from "./client";
import type { AIGenerationInput, AIGenerationResult, AITextGenerationInput } from "@/types";

export const aiApi = {
  generate: async (input: AIGenerationInput): Promise<AIGenerationResult> => {
    const { data } = await apiClient.post("/ai/generate", input);
    return data;
  },
  generateText: async (input: AITextGenerationInput): Promise<{ text: string }> => {
    const { data } = await apiClient.post("/ai/text", input);
    return data;
  },
};

import { GoogleGenerativeAI } from "@google/generative-ai";

// Model priority list — falls back if quota hit
const MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
];

export async function generateWithFallback(
  prompt: string,
  options: { temperature?: number; topP?: number } = {}
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: Error | null = null;

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: options.temperature ?? 1.0,
          topP:        options.topP        ?? 0.95,
        },
      });

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // If quota hit, try next model
      if (msg.includes("429") || msg.includes("quota") || msg.includes("not found")) {
        console.warn(`Model ${modelName} failed (${msg.includes("429") ? "quota" : "not found"}), trying next...`);
        lastError = err instanceof Error ? err : new Error(msg);
        continue;
      }
      // Any other error — throw immediately
      throw err;
    }
  }

  throw lastError ?? new Error("All AI models exhausted");
}

export function extractJSON(raw: string): unknown {
  const clean = raw.replace(/```json|```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in AI response");
  return JSON.parse(match[0]);
}

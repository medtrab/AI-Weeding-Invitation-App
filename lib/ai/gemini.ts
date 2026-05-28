import { GoogleGenerativeAI } from "@google/generative-ai";

// Confirmed available models from /api/ai/models — ordered by quality/speed
const MODELS = [
  "gemini-2.5-flash",      // Best — fast + smart
  "gemini-2.0-flash",      // Reliable fallback
  "gemini-2.0-flash-lite", // Lighter fallback
  "gemini-2.5-flash-lite", // Last resort
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
      const isRetryable =
        msg.includes("429") ||
        msg.includes("quota") ||
        msg.includes("404") ||
        msg.includes("not found") ||
        msg.includes("not supported") ||
        msg.includes("RESOURCE_EXHAUSTED");

      if (isRetryable) {
        console.warn(`Model ${modelName} unavailable (${msg.slice(0, 60)}), trying next…`);
        lastError = err instanceof Error ? err : new Error(msg);
        continue;
      }
      // Non-retryable error — throw immediately
      throw err;
    }
  }

  const isQuota = lastError?.message?.includes("429") ||
                  lastError?.message?.includes("quota") ||
                  lastError?.message?.includes("RESOURCE_EXHAUSTED");

  throw new Error(
    isQuota
      ? "AI quota exceeded — please wait a minute and try again"
      : `AI unavailable: ${lastError?.message ?? "unknown error"}`
  );
}

export function extractJSON(raw: string): unknown {
  const clean = raw.replace(/```json|```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in AI response");
  return JSON.parse(match[0]);
}

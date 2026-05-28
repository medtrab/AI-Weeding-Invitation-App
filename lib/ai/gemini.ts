import { GoogleGenerativeAI } from "@google/generative-ai";

// Current available free models (May 2026)
const MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash-latest",
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
        msg.includes("not supported");

      if (isRetryable) {
        console.warn(`Model ${modelName} unavailable, trying next…`);
        lastError = err instanceof Error ? err : new Error(msg);
        continue;
      }
      throw err;
    }
  }

  // All models failed — give a clear user-facing message
  const isQuota = lastError?.message?.includes("429") || lastError?.message?.includes("quota");
  throw new Error(
    isQuota
      ? "AI quota exceeded — please wait a minute and try again"
      : "No AI models available — please check your GEMINI_API_KEY"
  );
}

export function extractJSON(raw: string): unknown {
  const clean = raw.replace(/```json|```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in AI response");
  return JSON.parse(match[0]);
}

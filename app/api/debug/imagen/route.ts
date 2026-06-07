import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function GET(_req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY not set" });

  const prompt = "A beautiful romantic sunset over Mediterranean sea, cinematic, two silhouettes";
  const results: Record<string, string> = { apiKeyPrefix: apiKey.slice(0, 10) + "..." };

  // Test every possible Gemini image model
  const models = [
    "gemini-2.0-flash-preview-image-generation",
    "gemini-2.0-flash-exp-image-generation",
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
  ];

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
          }),
          signal: AbortSignal.timeout(15000),
        }
      );
      const text = await res.text();
      const hasImage = text.includes("inlineData");
      results[model] = `HTTP ${res.status} | hasImage=${hasImage} | ${text.slice(0, 150)}`;
    } catch (e) {
      results[model] = `FAIL: ${e instanceof Error ? e.message : e}`;
    }
  }

  return NextResponse.json(results);
}

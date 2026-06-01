import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY not set" });

  const testPrompt = "A beautiful sunset over mountains, romantic cinematic atmosphere";
  const results: Record<string, string> = {
    apiKeyPrefix: apiKey.slice(0, 8) + "...",
  };

  // Test 1: Imagen 3 via Generative Language API
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: testPrompt }],
          parameters: { sampleCount: 1, aspectRatio: "1:1" },
        }),
      }
    );
    const text = await res.text();
    results["imagen3_genai"] = `HTTP ${res.status}: ${text.slice(0, 400)}`;
  } catch (e) { results["imagen3_genai"] = `FAIL: ${e}`; }

  // Test 2: Gemini 2.0 Flash with image output
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Create an image of: ${testPrompt}` }] }],
          generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
        }),
      }
    );
    const text = await res.text();
    const hasImage = text.includes("inlineData") || text.includes("image");
    results["gemini_flash_image"] = `HTTP ${res.status}: hasImage=${hasImage}: ${text.slice(0, 300)}`;
  } catch (e) { results["gemini_flash_image"] = `FAIL: ${e}`; }

  // Test 3: Pollinations URL (just check if it's being generated)
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(testPrompt)}?width=512&height=512&model=flux`;
  results["pollinations_url"] = pollinationsUrl;

  return NextResponse.json(results, { status: 200 });
}

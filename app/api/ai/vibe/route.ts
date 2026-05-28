import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback, extractJSON } from "@/lib/ai/gemini";
import { buildVibePrompt } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ detail: "Invalid request body" }, { status: 400 }); }

  const { vibe, eventType = "wedding", language = "en" } = body;
  if (!vibe?.trim()) {
    return NextResponse.json({ detail: "Vibe is required" }, { status: 422 });
  }

  try {
    const prompt = buildVibePrompt({ eventType, language });
    const raw    = await generateWithFallback(`${prompt}\n\nUser vibe/song/mood: "${vibe}"`, { temperature: 1.2 });
    const data   = extractJSON(raw);
    return NextResponse.json(data);
  } catch (err) {
    const msg   = err instanceof Error ? err.message : "AI generation failed";
    const is429 = msg.includes("429") || msg.includes("quota");
    return NextResponse.json(
      { detail: is429 ? "AI quota exceeded — please try again in a minute" : msg },
      { status: is429 ? 429 : 500 }
    );
  }
}

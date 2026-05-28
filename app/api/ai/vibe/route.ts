import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildVibePrompt } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }

  const { vibe, eventType = "wedding", language = "en" } = body;

  if (!vibe?.trim()) {
    return NextResponse.json({ detail: "Vibe is required" }, { status: 422 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ detail: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 1.2, topP: 0.95 },
    });

    const prompt = buildVibePrompt({ eventType, language });
    const result = await model.generateContent(`${prompt}\n\nUser vibe/song/mood: "${vibe}"`);
    const raw    = result.response.text();
    const clean  = raw.replace(/```json|```/g, "").trim();

    // Extract JSON even if there's surrounding text
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ detail: "AI returned no valid JSON" }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error("AI vibe error:", err);
    return NextResponse.json(
      { detail: err instanceof Error ? err.message : "AI generation failed" },
      { status: 500 }
    );
  }
}

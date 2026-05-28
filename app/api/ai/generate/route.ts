import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildGenerationPrompt } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }

  const { prompt, eventType, language = "en", textStyle = "luxury" } = body;

  if (!prompt?.trim()) {
    return NextResponse.json({ detail: "Prompt is required" }, { status: 422 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ detail: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 1.1, topP: 0.95 },
    });

    const systemPrompt = buildGenerationPrompt({ eventType, language, textStyle });
    const result = await model.generateContent(`${systemPrompt}\n\nUser request: ${prompt}`);
    const raw    = result.response.text();
    const clean  = raw.replace(/```json|```/g, "").trim();

    // Extract JSON even if there's surrounding text
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ detail: "AI returned no valid JSON" }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error("AI generate error:", err);
    return NextResponse.json(
      { detail: err instanceof Error ? err.message : "AI generation failed" },
      { status: 500 }
    );
  }
}

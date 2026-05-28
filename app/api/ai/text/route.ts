import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildTextGenerationPrompt } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }

  const { eventType, coupleName, eventDate, venue, language, textStyle, additionalDetails } = body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ detail: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = buildTextGenerationPrompt({ language, textStyle });
    const userContent = [
      `Event type: ${eventType}`,
      coupleName        && `Names: ${coupleName}`,
      eventDate         && `Date: ${new Date(eventDate).toLocaleDateString()}`,
      venue             && `Venue: ${venue}`,
      additionalDetails && `Additional: ${additionalDetails}`,
    ].filter(Boolean).join("\n");

    const result = await model.generateContent(`${systemPrompt}\n\n${userContent}`);
    return NextResponse.json({ text: result.response.text() });
  } catch (err) {
    console.error("AI text error:", err);
    return NextResponse.json(
      { detail: err instanceof Error ? err.message : "AI generation failed" },
      { status: 500 }
    );
  }
}

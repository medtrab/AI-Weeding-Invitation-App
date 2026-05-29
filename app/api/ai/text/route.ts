import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai/gemini";
import { buildTextGenerationPrompt } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ detail: "Invalid request body" }, { status: 400 }); }

  const { eventType, coupleName, eventDate, venue, language, textStyle, additionalDetails } = body;

  try {
    const systemPrompt = buildTextGenerationPrompt({ language: language as "en" | "fr" | "ar" | undefined, textStyle });
    const userContent  = [
      `Event type: ${eventType}`,
      coupleName        && `Names: ${coupleName}`,
      eventDate         && `Date: ${new Date(eventDate).toLocaleDateString()}`,
      venue             && `Venue: ${venue}`,
      additionalDetails && `Additional: ${additionalDetails}`,
    ].filter(Boolean).join("\n");

    const text = await generateWithFallback(`${systemPrompt}\n\n${userContent}`);
    return NextResponse.json({ text });
  } catch (err) {
    const msg   = err instanceof Error ? err.message : "AI generation failed";
    const is429 = msg.includes("429") || msg.includes("quota");
    return NextResponse.json(
      { detail: is429 ? "AI quota exceeded — please try again in a minute" : msg },
      { status: is429 ? 429 : 500 }
    );
  }
}

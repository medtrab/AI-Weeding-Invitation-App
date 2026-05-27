import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import Anthropic from "@anthropic-ai/sdk";
import { buildTextGenerationPrompt } from "@/lib/ai/prompts";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const { eventType, coupleName, eventDate, venue, language, textStyle, additionalDetails } = await req.json();

  const userContent = [
    `Event type: ${eventType}`,
    coupleName && `Names: ${coupleName}`,
    eventDate && `Date: ${new Date(eventDate).toLocaleDateString()}`,
    venue && `Venue: ${venue}`,
    additionalDetails && `Additional: ${additionalDetails}`,
  ].filter(Boolean).join("\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system: buildTextGenerationPrompt({ language, textStyle }),
    messages: [{ role: "user", content: userContent }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  return NextResponse.json({ text });
}

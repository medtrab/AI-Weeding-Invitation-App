import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildTextGenerationPrompt } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const { eventType, coupleName, eventDate, venue, language, textStyle, additionalDetails } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ detail: "GEMINI_API_KEY not configured" }, { status: 500 });

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
}

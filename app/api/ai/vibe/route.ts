import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildVibePrompt } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const { vibe, eventType = "wedding", language = "en" } = await req.json();
  if (!vibe?.trim()) {
    return NextResponse.json({ detail: "Vibe is required" }, { status: 422 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ detail: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { temperature: 1.2, topP: 0.95 },
  });

  const prompt = buildVibePrompt({ eventType, language });
  const result = await model.generateContent(`${prompt}\n\nUser vibe/song/mood: "${vibe}"`);
  const raw    = result.response.text();
  const clean  = raw.replace(/```json|```/g, "").trim();

  try {
    return NextResponse.json(JSON.parse(clean));
  } catch {
    return NextResponse.json(
      { detail: "AI returned malformed response, please try again" },
      { status: 500 }
    );
  }
}

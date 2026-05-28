import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildGenerationPrompt } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const { prompt, eventType, language = "en", textStyle = "luxury" } = await req.json();
  if (!prompt?.trim()) return NextResponse.json({ detail: "Prompt is required" }, { status: 422 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ detail: "GEMINI_API_KEY not configured" }, { status: 500 });

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const systemPrompt = buildGenerationPrompt({ eventType, language, textStyle });

  const result = await model.generateContent(`${systemPrompt}\n\nUser request: ${prompt}`);
  const raw    = result.response.text();
  const clean  = raw.replace(/```json|```/g, "").trim();

  try {
    return NextResponse.json(JSON.parse(clean));
  } catch {
    return NextResponse.json({ detail: "AI returned malformed response, please try again" }, { status: 500 });
  }
}

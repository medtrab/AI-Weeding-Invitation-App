import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import Anthropic from "@anthropic-ai/sdk";
import { buildGenerationPrompt } from "@/lib/ai/prompts";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const { prompt, eventType, language = "en", textStyle = "luxury" } = await req.json();
  if (!prompt?.trim()) return NextResponse.json({ detail: "Prompt is required" }, { status: 422 });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: buildGenerationPrompt({ eventType, language, textStyle }),
    messages: [{ role: "user", content: prompt }],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";
  const clean = raw.replace(/```json|```/g, "").trim();
  try {
    return NextResponse.json(JSON.parse(clean));
  } catch {
    return NextResponse.json({ detail: "AI returned malformed response" }, { status: 500 });
  }
}

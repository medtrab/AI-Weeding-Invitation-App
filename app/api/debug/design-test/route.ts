import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback, extractJSON } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json() as { prompt: string };
  try {
    const raw = await generateWithFallback(prompt, { temperature: 0.9 });
    let parsed = null;
    let parseError = null;
    try { parsed = extractJSON(raw); } catch (e) { parseError = String(e); }
    return NextResponse.json({ rawLength: raw.length, rawPreview: raw.slice(0, 800), parsed, parseError });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

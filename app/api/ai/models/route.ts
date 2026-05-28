import { NextRequest, NextResponse } from "next/server";

// Debug endpoint — visit /api/ai/models to see what models your key supports
export async function GET(_req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ detail: "No GEMINI_API_KEY set" }, { status: 500 });

  const res  = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );
  const data = await res.json();

  // Filter to only models that support generateContent
  const generateModels = (data.models ?? [])
    .filter((m: { supportedGenerationMethods?: string[] }) =>
      m.supportedGenerationMethods?.includes("generateContent")
    )
    .map((m: { name: string; displayName: string }) => ({
      name: m.name,
      displayName: m.displayName,
    }));

  return NextResponse.json({ available: generateModels, raw: data });
}

import { NextRequest, NextResponse } from "next/server";
import { generateSceneImage, generateImagePrompt } from "@/lib/ai/imagen";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const { prompt, coupleName } = await req.json() as { prompt: string; coupleName?: string };
  if (!prompt?.trim()) return NextResponse.json({ detail: "Prompt required" }, { status: 422 });

  try {
    // Step 1: Optimize prompt for image generation
    const imagePrompt = await generateImagePrompt(prompt, coupleName || "the couple");

    // Step 2: Try Imagen 3 (needs billing-enabled Google Cloud)
    const imageData = await generateSceneImage(imagePrompt);
    if (imageData) {
      return NextResponse.json({ imageData, imagePrompt, source: "imagen3" });
    }

    // Step 3: Return Pollinations URL (free, works in browser)
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1080&height=1920&model=flux&nologo=true&enhance=true&seed=${Date.now()}`;
    return NextResponse.json({ imagePrompt, pollinationsUrl, source: "pollinations" });

  } catch (err) {
    return NextResponse.json({ detail: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

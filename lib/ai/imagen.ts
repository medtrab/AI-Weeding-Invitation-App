// Image generation for wedding invitations
// Strategy:
// 1. Try Gemini 2.0 Flash experimental image generation (native, best quality)
// 2. Fall back to Pollinations.ai Flux Pro (good quality, via server proxy)

export async function generateSceneImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  // Try Gemini imagen via the new gemini-2.0-flash-preview-image-generation model
  const models = [
    "gemini-2.0-flash-preview-image-generation",
    "gemini-2.0-flash-exp",
  ];

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Generate a high-quality image: ${prompt}` }] }],
            generationConfig: { responseModalities: ["IMAGE"] },
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.warn(`Gemini image (${model}) failed:`, err.slice(0, 100));
        continue;
      }

      const data = await res.json() as {
        candidates?: Array<{
          content?: { parts?: Array<{ inlineData?: { mimeType: string; data: string } }> }
        }>
      };

      const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part?.inlineData) {
        console.log(`✅ Gemini image generated via ${model}`);
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    } catch (err) {
      console.warn(`Gemini image (${model}) error:`, err instanceof Error ? err.message : err);
    }
  }

  return null; // Fall back to Pollinations
}

// Build a Pollinations.ai URL — high quality settings
export function buildPollinationsUrl(prompt: string): string {
  const seed = Math.floor(Math.random() * 999999) + 1;
  const params = new URLSearchParams({
    width:   "1080",
    height:  "1920",
    model:   "flux-pro",
    nologo:  "true",
    enhance: "true",
    seed:    String(seed),
  });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
}

// Generate an optimized image prompt for maximum visual quality
export async function generateImagePrompt(themeDescription: string, coupleName: string): Promise<string> {
  const { generateWithFallback } = await import("./gemini");

  const prompt = `You are an expert AI image prompt engineer for wedding invitations.
Convert this wedding theme into a vivid image generation prompt.

Theme: ${themeDescription}
Couple: ${coupleName}

Rules:
- NO text, NO words, NO letters, NO numbers in the image
- Portrait/vertical composition
- Describe: art style + setting + lighting + atmosphere + specific elements + two silhouettes from behind
- End with: masterpiece, ultra-detailed, cinematic composition, 8k, beautiful, emotional, romantic
- 100-150 words maximum

Return ONLY the prompt text.`;

  const result = await generateWithFallback(prompt, { temperature: 0.9 });
  return result.trim().replace(/^["'`]|["'`]$/g, "");
}

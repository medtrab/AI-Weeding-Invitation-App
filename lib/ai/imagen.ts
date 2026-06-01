// Image generation for wedding invitations
// Uses Pollinations.ai Flux model (free, no API key, excellent quality)
// Imagen 3 requires Vertex AI service account credentials (not API key)

export async function generateSceneImage(_prompt: string): Promise<string | null> {
  // Imagen 3 via generativelanguage.googleapis.com is NOT supported with API keys
  // It requires Vertex AI service account credentials
  // Return null to trigger Pollinations fallback
  return null;
}

// Build a Pollinations.ai URL for the given image prompt
// This URL works as a direct <img src> in the browser
export function buildPollinationsUrl(prompt: string): string {
  const seed = Math.floor(Math.random() * 1000000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1080&height=1920&model=flux&nologo=true&enhance=true&seed=${seed}`;
}

// Generate an optimized image prompt from user's theme description
export async function generateImagePrompt(themeDescription: string, coupleName: string): Promise<string> {
  const { generateWithFallback } = await import("./gemini");

  const prompt = `You are a professional AI image prompt engineer for wedding invitations.
Convert this wedding theme into a vivid image generation prompt.

Theme: ${themeDescription}
Couple: ${coupleName}

Rules:
- NO text, NO words, NO letters anywhere in the image
- Portrait orientation (9:16)
- Describe: setting, lighting, atmosphere, mood, colors, art style
- Be specific and vivid (e.g. "golden lanterns reflecting on still water", "cherry blossoms drifting past stone temple gates at dusk")
- Art style: anime cinematic / oil painting / watercolor / photorealistic (pick what fits)
- End with: "masterpiece, ultra-detailed, cinematic composition, beautiful, emotional, romantic"
- Maximum 120 words

Return ONLY the image prompt text.`;

  const result = await generateWithFallback(prompt, { temperature: 0.9 });
  return result.trim();
}

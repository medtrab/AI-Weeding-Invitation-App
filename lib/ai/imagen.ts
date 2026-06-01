import { GoogleGenerativeAI } from "@google/generative-ai";

// Generate a cinematic scene image using Gemini Imagen 3
// Returns base64 image data or null if unavailable
export async function generateSceneImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    // Use the Gemini REST API directly for Imagen 3
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "9:16",   // Portrait for mobile invitation
            personGeneration: "allow_adult",
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.warn("Imagen 3 error:", err.slice(0, 200));
      return null;
    }

    const data = await response.json() as {
      predictions?: Array<{ bytesBase64Encoded?: string; mimeType?: string }>
    };
    const img = data.predictions?.[0];
    if (!img?.bytesBase64Encoded) return null;

    return `data:${img.mimeType || "image/png"};base64,${img.bytesBase64Encoded}`;
  } catch (err) {
    console.warn("Image generation failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

// Generate an optimized image prompt from user's theme description
export async function generateImagePrompt(themeDescription: string, coupleName: string): Promise<string> {
  const { generateWithFallback } = await import("./gemini");

  const prompt = `You are a professional AI image prompt engineer specializing in wedding invitations.
Convert this wedding theme description into a single optimized image generation prompt.

Theme: ${themeDescription}
Couple: ${coupleName}

Requirements:
- Portrait orientation (9:16 ratio)
- Cinematic, high quality, detailed
- No text, no words, no letters in the image
- Focus on the visual scene, atmosphere, and mood
- Include: lighting, atmosphere, color palette, art style
- Maximum 150 words
- End with: "masterpiece, highly detailed, cinematic lighting, 8k, beautiful"

Return ONLY the image prompt, nothing else.`;

  const result = await generateWithFallback(prompt, { temperature: 0.8 });
  return result.trim();
}

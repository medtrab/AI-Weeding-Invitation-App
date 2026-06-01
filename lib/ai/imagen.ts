// Image generation for wedding invitations
// Uses Pollinations.ai Flux model (free, no API key, excellent quality)
// Imagen 3 requires Vertex AI service account credentials (not API key)

export async function generateSceneImage(_prompt: string): Promise<string | null> {
  // Imagen 3 via generativelanguage.googleapis.com is NOT supported with API keys
  // It requires Vertex AI service account credentials
  // Return null to trigger Pollinations fallback
  return null;
}

// Build a Pollinations.ai URL — higher quality settings
export function buildPollinationsUrl(prompt: string): string {
  const seed = Math.floor(Math.random() * 999999) + 1;
  // flux-pro gives much better quality than base flux
  // width/height at 768x1366 (9:16) balances quality vs load time
  const params = new URLSearchParams({
    width:   "768",
    height:  "1366",
    model:   "flux-pro",    // Higher quality than base flux
    nologo:  "true",
    enhance: "true",        // Auto-enhance prompt
    seed:    String(seed),
  });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
}

// Alternative: build a URL using a different free service as backup
export function buildBackupImageUrl(prompt: string): string {
  // Lexica Aperture — high quality, free
  const seed = Math.floor(Math.random() * 999999) + 1;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=1366&model=flux-realism&nologo=true&seed=${seed}`;
}

// Generate a highly optimized image prompt for maximum visual quality
export async function generateImagePrompt(themeDescription: string, coupleName: string): Promise<string> {
  const { generateWithFallback } = await import("./gemini");

  const prompt = `You are an expert AI image prompt engineer. Create a stunning image generation prompt for a wedding invitation background.

Theme description: ${themeDescription}
Couple: ${coupleName}

CRITICAL RULES:
- ABSOLUTELY NO text, words, letters, numbers, or writing in the image
- Portrait/vertical composition (taller than wide)
- The image should be a SCENE or LANDSCAPE — not just a pattern
- NO faces visible (characters from behind only if included)

STRUCTURE YOUR PROMPT AS:
[Art style] + [Main scene/setting] + [Lighting details] + [Atmosphere/mood] + [Specific visual elements] + [Color palette] + [Quality tags]

Example for Naruto theme:
"Anime cinematic illustration, hidden ninja village at dusk seen from above, ancient Japanese architecture with curved rooftops, giant stone mountain carvings in background, hundreds of warm orange and red paper lanterns floating upward, full moon rising behind misty mountains, cherry blossom petals swirling in wind, two small silhouettes standing on wooden bridge from behind, golden chakra energy particles glowing, deep purple and orange twilight sky, Makoto Shinkai art style, volumetric lighting, ultra-detailed, 8k resolution, masterpiece quality, emotional romantic atmosphere"

Now write the prompt for the given theme. Be EXTREMELY specific and vivid. 100-180 words.
Return ONLY the prompt text, nothing else.`;

  const result = await generateWithFallback(prompt, { temperature: 0.95 });
  return result.trim().replace(/^["']|["']$/g, ""); // Remove surrounding quotes
}

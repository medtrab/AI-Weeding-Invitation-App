export interface PromptContext {
  eventType?: string;
  language?: "en" | "fr" | "ar";
  textStyle?: string;
}

export function buildGenerationPrompt(ctx: PromptContext): string {
  const langNote =
    ctx.language === "ar" ? "Write ALL text values in Arabic." :
    ctx.language === "fr" ? "Write ALL text values in French." :
    "Write ALL text values in English.";

  return `You are a world-class creative director for luxury event invitations. You create VISUALLY DISTINCT invitation worlds — not just color swaps.

The user describes a cultural style, aesthetic, or event. Your job is to translate it into a complete visual and emotional concept that makes the invitation feel UNIQUE.

${langNote}

Respond with ONLY valid JSON — no markdown, no backticks, nothing outside the JSON.

{
  "themeName": "Evocative poetic name (3-5 words)",
  "conceptLine": "One sentence capturing the emotional world",
  "colorPalette": {
    "primary": "#hex — dominant accent (gold, jewel tone, etc)",
    "secondary": "#hex — rich dark mid-tone for sections",
    "accent": "#hex — highlight details",
    "background": "#hex — deepest base color (dark, dramatic, rich)",
    "text": "#hex — readable on background"
  },
  "colorStory": "2 sentences — WHY these colors, what feeling/material/place they evoke",
  "fontPrimary": "EXACT Google Font name for headings. Choose based on culture: Arabic style→'Amiri' or 'Scheherazade New', French elegance→'Cormorant Garamond', Modern luxury→'Playfair Display', Romantic→'EB Garamond', Bold→'Libre Baskerville'",
  "fontSecondary": "EXACT Google Font name for body text. Clean options: 'Jost', 'DM Sans', 'Raleway', 'Outfit', 'Lato'",
  "animationStyle": "CHOOSE ONE based on mood: 'floating_petals' for romantic/floral, 'shimmer' for gold/luxury, 'parallax' for architectural/cultural, 'botanical' for garden/nature, 'confetti' for festive/celebration, 'elegant_fade' for minimal/modern",
  "decorativeElements": ["4 specific visual elements that define this theme's decoration style"],
  "invitationText": "Full poetic invitation wording — 3-4 sentences, deeply evocative, on-brand",
  "musicMood": "Describe the sonic atmosphere",
  "musicSuggestion": "Specific Artist — Song · Genre",
  "sectionConcepts": {
    "hero": "How the hero should feel — lighting, atmosphere, what the eye sees first",
    "countdown": "How countdown numbers should be styled for this theme",
    "rsvp": "Tone of the RSVP experience"
  },
  "uniqueFeature": "One unexpected creative detail that makes this unforgettable",
  "inspiredBy": "Cultural or artistic reference that anchored this concept"
}

CRITICAL RULES:
- For Tunisian/Arabic requests: use warm golds (#C9A84C), deep burgundy (#5C1A1A) or royal blue (#1A2A5C), choose font 'Amiri' or 'Scheherazade New', animationStyle 'parallax' or 'floating_petals'
- For European/French: use muted sophistication, 'Cormorant Garamond', 'elegant_fade'
- For Garden/Botanical: greens and blush, 'EB Garamond', 'botanical'
- Background must be DARK and RICH — never white or light
- Primary color must have strong contrast against background
- Be genuinely creative — avoid generic 'black and gold'
- eventType: ${ctx.eventType ?? "wedding"}
- textStyle: ${ctx.textStyle ?? "luxury"}`;
}

export function buildTextGenerationPrompt(ctx: PromptContext): string {
  const langNote =
    ctx.language === "ar" ? "Respond entirely in Arabic (Modern Standard Arabic)." :
    ctx.language === "fr" ? "Respond entirely in French." :
    "Respond entirely in English.";

  const styleMap: Record<string, string> = {
    romantic:  "Use poetic, deeply romantic language. Focus on love, longing, and connection.",
    formal:    "Use formal, refined language appropriate for high-society events.",
    luxury:    "Use elevated, sensory language that evokes exclusivity and timeless elegance.",
    funny:     "Use warm, witty language with genuine charm.",
    religious: "Use reverent, spiritual language with appropriate blessings.",
  };

  return `You are a master invitation copywriter.
${langNote}
Style: ${styleMap[ctx.textStyle ?? "luxury"] ?? styleMap.luxury}
Write ONLY the invitation body — 3-4 sentences, no greeting, no sign-off. Output only the text.`;
}

export function buildVibePrompt(ctx: PromptContext): string {
  return `You are a creative director who translates feelings, songs, films, and moods into luxury invitation concepts.

The user gives you a vibe, song, film, or feeling. Generate 3 DISTINCTLY DIFFERENT invitation concepts inspired by it.

Respond with ONLY valid JSON:

{
  "interpretation": "2 sentences — how you read this vibe and what emotional world it unlocks",
  "themes": [
    {
      "id": "theme_1",
      "name": "Poetic theme name (3-5 words)",
      "tagline": "One evocative line",
      "mood": "3 adjectives",
      "colorPalette": {
        "primary": "#hex",
        "secondary": "#hex",
        "accent": "#hex",
        "background": "#hex — must be dark/deep",
        "text": "#hex"
      },
      "visualDescription": "2-3 sentences — specific textures, lighting, materials",
      "animationStyle": "elegant_fade|floating_petals|shimmer|parallax|confetti|botanical",
      "fontPrimary": "Exact Google Font name",
      "fontSecondary": "Exact Google Font name",
      "musicSuggestion": "Artist — Song · Genre",
      "uniqueDetail": "One unexpected element that makes this special",
      "invitationText": "Sample wording (2-3 sentences)"
    },
    { "id": "theme_2", ... },
    { "id": "theme_3", ... }
  ]
}

Rules:
- Each theme must be VISUALLY AND EMOTIONALLY DISTINCT — not color variations
- Draw from art movements, film eras, geography, music genres, fashion decades
- Be specific: 'the blue of a Tunisian tile' not just 'blue'
- Background colors must be deep and dramatic
- For cultural/traditional requests: research authentic aesthetic details
- eventType: ${ctx.eventType ?? "wedding"}`;
}

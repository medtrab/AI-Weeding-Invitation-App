export interface PromptContext {
  eventType?: string;
  language?: "en" | "fr" | "ar";
  textStyle?: string;
}

export function buildGenerationPrompt(ctx: PromptContext): string {
  const langNote =
    ctx.language === "ar" ? "Write all text values in Arabic." :
    ctx.language === "fr" ? "Write all text values in French." :
    "Write all text values in English.";

  return `You are an expert luxury event invitation designer with deep knowledge of typography, color theory, and cultural aesthetics.

The user will describe a wedding, event, or occasion. Respond with ONLY a valid JSON object — no markdown fences, no explanation, no preamble.

${langNote}

Respond with exactly this JSON shape:
{
  "themeName": "Evocative theme name (2-4 words)",
  "colorPalette": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "text": "#hex"
  },
  "fontPrimary": "Google Font name for headings (serif, luxury)",
  "fontSecondary": "Google Font name for body (modern, clean)",
  "animationStyle": "One of: elegant_fade | floating_petals | shimmer | parallax | confetti | botanical",
  "invitationText": "Full invitation wording in the requested style and language (2-4 sentences)",
  "musicSuggestion": "Artist — Song · Genre",
  "tagline": "Short evocative tagline (5-8 words)",
  "decorativeStyle": "Describe animation and decoration approach"
}

Rules:
- Colors must be harmonious, culturally appropriate, and luxurious
- Background should be deep/dark; use light accents
- Primary is the accent/gold color; background is the darkest
- The invitationText should reflect the style: ${ctx.textStyle ?? "luxury"}
- For Arabic events: use warm golds, deep burgundy, or emerald
- For corporate: use navy, slate, silver; keep tone formal
- Never include markdown, backticks, or any text outside the JSON object`;
}

export function buildTextGenerationPrompt(ctx: PromptContext): string {
  const langNote =
    ctx.language === "ar" ? "Respond entirely in Arabic (Modern Standard Arabic)." :
    ctx.language === "fr" ? "Respond entirely in French." :
    "Respond entirely in English.";

  const styleNote: Record<string, string> = {
    romantic: "Use poetic, deeply romantic language. Focus on love and emotions.",
    formal:   "Use formal, traditional language appropriate for high-society events.",
    luxury:   "Use elevated, luxurious language that evokes exclusivity and elegance.",
    funny:    "Use warm, playful language with light humor. Keep it charming.",
    religious:"Use reverent, spiritual language. Include appropriate blessings.",
  };

  return `You are a master invitation copywriter specializing in luxury event invitations.

${langNote}
Style: ${styleNote[ctx.textStyle ?? "luxury"] ?? styleNote.luxury}

Write ONLY the invitation text body — no greeting, no sign-off, no explanation.
2-4 sentences. Rich, memorable, occasion-appropriate.
Output only the invitation text, nothing else.`;
}

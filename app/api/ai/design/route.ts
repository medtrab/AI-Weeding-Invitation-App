import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { generateWithFallback, extractJSON } from "@/lib/ai/gemini";
import { buildPollinationsUrl } from "@/lib/ai/imagen";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ detail: "Invalid body" }, { status: 400 }); }

  const {
    invitationId   = "",
    coupleName     = "The Couple",
    eventDate      = new Date().toISOString(),
    venue          = "A Beautiful Venue",
    language       = "en",
    style          = "luxury",
    additionalDetails = "",
  } = body as Record<string, string>;

  const langLabel = language === "ar" ? "Arabic" : language === "fr" ? "French" : "English";
  const dateLabel = (() => {
    try { return new Date(eventDate).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" }); }
    catch { return eventDate; }
  })();

  // ── Single focused prompt ───────────────────────────────────────────────
  // Shorter = better for Gemini. Key details first, schema last.
  const prompt = `You are a luxury wedding invitation designer. Generate a unique, deeply themed JSON spec.

WEDDING DETAILS:
- Couple: ${coupleName}
- Date: ${dateLabel}  
- Venue: ${venue}
- Language for all text: ${langLabel}
- Style: ${style}

USER'S THEME & SECTIONS:
${additionalDetails || `Beautiful ${style} wedding. Include: cover, love story, guest greeting (use {{GUEST_NAME}}), event details, wish section.`}

Return ONLY this JSON (no markdown, no explanation):
{
  "theme": {
    "name": "unique theme name",
    "palette": {
      "bg": "#hex",
      "surface": "#hex",
      "primary": "#hex",
      "accent": "#hex",
      "text": "#hex",
      "textMuted": "#hex"
    },
    "fontHeading": "Google Font name",
    "fontBody": "Google Font name",
    "direction": "ltr",
    "petalEmoji": "🌸",
    "topSymbol": "✦"
  },
  "imagePrompt": "120-150 word image generation prompt. NO text or letters in image. Describe: art style + scene + lighting + atmosphere + specific visual elements from the theme + two silhouettes from behind + color palette. End with: masterpiece, ultra-detailed, 8k, cinematic, romantic",
  "coverSpec": {
    "tagline": "short poetic line in ${langLabel}",
    "storyLabel": "label in ${langLabel}",
    "storyText": "2-3 romantic sentences in ${langLabel} inspired by the theme",
    "detailsLabel": "label in ${langLabel}",
    "venueIcon": "📍",
    "messageTitle": "title in ${langLabel}",
    "thankEmoji": "🕊️"
  },
  "sections": [
    {
      "type": "hero",
      "heading": "main heading in ${langLabel}",
      "subheading": "date/venue teaser in ${langLabel}",
      "quote": "poetic quote in ${langLabel}"
    },
    {
      "type": "story",
      "heading": "story heading in ${langLabel}",
      "message": "romantic story in ${langLabel} - 3 sentences deeply inspired by theme"
    },
    {
      "type": "guest",
      "heading": "greeting heading in ${langLabel}",
      "message": "warm personal message in ${langLabel} to {{GUEST_NAME}}"
    },
    {
      "type": "venue",
      "heading": "venue heading in ${langLabel}",
      "venueName": "${venue}",
      "venueDescription": "atmospheric venue description in ${langLabel}",
      "time": "time from event date",
      "dresscode": "theme-appropriate dresscode in ${langLabel}"
    },
    {
      "type": "message",
      "heading": "wish section heading in ${langLabel}",
      "placeholder": "input placeholder in ${langLabel}",
      "submitLabel": "button text in ${langLabel}"
    }
  ]
}

CRITICAL RULES:
1. ALL text fields must be in ${langLabel}
2. Make EVERY text specific to the theme — zero generic phrases
3. imagePrompt: NO text/words/letters in image, characters from behind only
4. The theme, colors, fonts, emojis must all match the style: ${style}
5. If Arabic: direction must be "rtl", use Amiri or Scheherazade New font
6. Generate sections exactly as user requested above — not just these defaults`;

  try {
    const raw  = await generateWithFallback(prompt, { temperature: 0.95 });
    const data = extractJSON(raw) as { imagePrompt?: string; theme?: { palette?: Record<string,string> }; [key: string]: unknown };

    // Generate image
    const pollinationsUrl = data.imagePrompt ? buildPollinationsUrl(data.imagePrompt) : null;

    // Save to DB
    const palette = data.theme?.palette;
    const generatedHtml = JSON.stringify({
      __cinematic: true, __spec: true,
      spec: data, imageData: null, pollinationsUrl, imagePrompt: data.imagePrompt || null,
    });

    if (invitationId) {
      await db.invitation.update({
        where: { id: invitationId },
        data: {
          generatedHtml,
          ...(palette ? { colorPalette: {
            background: palette.bg      || "#0D0B08",
            secondary:  palette.surface || "#1A1608",
            primary:    palette.primary || "#C9A84C",
            accent:     palette.accent  || "#E8C86A",
            text:       palette.text    || "#FAF7F2",
          }} : {}),
        },
      }).catch((e: unknown) => console.warn("DB save:", e));
    }

    return NextResponse.json({ spec: data, pollinationsUrl, imagePrompt: data.imagePrompt, generatedHtml, invitationId });

  } catch (err) {
    return NextResponse.json({ detail: err instanceof Error ? err.message : "Generation failed" }, { status: 500 });
  }
}

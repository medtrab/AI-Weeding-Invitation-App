import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { generateWithFallback, extractJSON } from "@/lib/ai/gemini";
import { generateSceneImage, buildPollinationsUrl } from "@/lib/ai/imagen";

// ── System prompt — creative director ─────────────────────────────────────
const SYSTEM_PROMPT = `You are a world-class wedding invitation creative director and visual artist.
Think: Makoto Shinkai films, Studio Ghibli atmosphere, luxury editorial design, high-end wedding magazines.
You receive a detailed brief from the user describing their theme, sections, and content.
Your job: generate a complete, deeply personalized JSON design spec.

CRITICAL RULES:
- Be ULTRA specific — no generic output
- Every text field must match the theme language and atmosphere
- The imagePrompt must be 120-180 words, extremely vivid, NO text/letters/words in image
- Generate EXACTLY the sections the user requests, in that order
- All text must be in the requested language
- {{GUEST_NAME}} placeholder: use ONLY in guest section message, nowhere else

Return ONLY valid JSON with this structure:

{
  "theme": {
    "name": "Evocative theme name",
    "palette": {
      "bg": "#hex dark atmospheric background",
      "surface": "#hex slightly lighter surface",
      "primary": "#hex hero accent (gold/crimson/jade/etc)",
      "accent": "#hex secondary highlight",
      "text": "#hex main text color",
      "textMuted": "#hex subtle text"
    },
    "fontHeading": "Google Font — pick perfectly for theme (Amiri, Cinzel, Noto Serif JP, Scheherazade New, Playfair Display, Cormorant Garamond, Dancing Script, etc)",
    "fontBody": "Clean Google Font (Jost, Raleway, DM Sans, Nunito)",
    "direction": "ltr or rtl",
    "petalEmoji": "Floating particle emoji matching theme 🌸 ❄️ 🍂 ✨ 🌟 ⚡ 🌺",
    "topSymbol": "Theme symbol/emoji for cover ✦ 🌸 ⚔️ 🕌 🏯 ❋ 🌙"
  },
  "imagePrompt": "120-180 word vivid scene description for AI image generation. NO text, NO words, NO letters. Structure: [Art style e.g. anime cinematic / oil painting / digital art] + [Main scene with rich details] + [Lighting: golden hour / moonlit / lantern glow / etc] + [Atmosphere and mood] + [Specific thematic visual elements] + [Two silhouettes from behind if people present] + [Color palette description] + masterpiece, ultra-detailed, 8k, cinematic composition, emotionally evocative, beautiful",
  "coverSpec": {
    "tagline": "Short poetic line max 8 words matching theme language",
    "storyLabel": "Section label e.g. Our Journey / The Mission / Notre Histoire",
    "storyText": "2-3 poetic sentences about the couple inspired by theme. Romantic and specific. No {{GUEST_NAME}}.",
    "detailsLabel": "Event details label matching theme e.g. The Grand Celebration / La Cérémonie",
    "venueIcon": "Venue emoji fitting theme 🏯 🕌 🏰 🌴 ⛩️ 🌹",
    "messageTitle": "Wish section title e.g. Leave a Wish / Send Your Blessing",
    "thankEmoji": "Thank you emoji 🕊️ 🌸 ⚔️ etc"
  },
  "sections": [
    // Generate EXACTLY the sections the user requested
    // Each section type has specific fields:
    //
    // type "hero": { type, heading, subheading, quote }
    // type "welcome": { type, heading, message }
    // type "story": { type, heading, message }
    // type "guest": { type, heading, message (use {{GUEST_NAME}} once) }
    // type "venue": { type, heading, venueName, venueDescription, time, dresscode }
    // type "countdown": { type, heading }
    // type "rsvp": { type, heading, placeholder, submitLabel }
    // type "message": { type, heading, placeholder, submitLabel }
    // type "dresscode": { type, heading, message }
    // type "custom": { type, heading, message }
    //
    // All text in the requested language. Deep theme integration.
  ]
}`;

// ── Route ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ detail: "Invalid body" }, { status: 400 }); }

  const {
    invitationId,
    coupleName    = "The Couple",
    eventDate     = new Date().toISOString(),
    venue         = "A Beautiful Venue",
    language      = "en",
    style         = "luxury",
    culturalBackground = "",
    additionalDetails  = "",
    guestName          = "",
  } = body as Record<string, string>;

  // ── Build the user prompt — additionalDetails IS the main prompt ──────
  const langLabel = language === "ar" ? "Arabic (RTL)" : language === "fr" ? "French" : "English";
  const dateLabel = (() => {
    try { return new Date(eventDate).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" }); }
    catch { return eventDate; }
  })();

  const userPrompt = `
═══════════════════════════════════════
WEDDING INVITATION BRIEF
═══════════════════════════════════════

COUPLE: ${coupleName}
DATE: ${dateLabel}
VENUE: ${venue}
LANGUAGE: ${langLabel}
STYLE: ${style}${culturalBackground ? ` — ${culturalBackground}` : ""}
${guestName ? `GUEST NAME EXAMPLE: ${guestName}` : ""}

═══════════════════════════════════════
THEME & SECTIONS REQUESTED BY USER:
═══════════════════════════════════════

${additionalDetails || `Create a beautiful ${style} wedding invitation with:
- A stunning cover with couple names
- Romantic love story section  
- Personalized guest greeting using {{GUEST_NAME}}
- Event details with venue and date
- Guest wish/message section`}

═══════════════════════════════════════
INSTRUCTIONS:
═══════════════════════════════════════
1. Read the user's theme description and sections carefully
2. Generate imagePrompt that perfectly captures the visual atmosphere described
3. Create sections EXACTLY as requested — same order, same types
4. Write all text in ${langLabel}
5. Make EVERY detail deeply specific to this theme — no generic wedding text
6. The imagePrompt MUST have NO text/letters/words in the image
`.trim();

  try {
    const raw  = await generateWithFallback(
      `${SYSTEM_PROMPT}\n\n${userPrompt}`,
      { temperature: 1.0 }
    );
    const data = extractJSON(raw) as { imagePrompt?: string; [key: string]: unknown };

    // Generate background image
    let imageData: string | null = null;
    let pollinationsUrl: string | null = null;

    if (data.imagePrompt) {
      imageData       = await generateSceneImage(data.imagePrompt);
      pollinationsUrl = buildPollinationsUrl(data.imagePrompt);
    }

    // Extract palette and save to DB
    const palette = (data as { theme?: { palette?: Record<string, string> } }).theme?.palette;

    const generatedHtml = JSON.stringify({
      __cinematic:    true,
      __spec:         true,
      spec:           data,
      imageData:      imageData       || null,
      pollinationsUrl: pollinationsUrl || null,
      imagePrompt:    data.imagePrompt || null,
    });

    if (invitationId) {
      await db.invitation.update({
        where: { id: invitationId },
        data: {
          generatedHtml,
          ...(palette ? {
            colorPalette: {
              background: palette.bg      || palette.background || "#0D0B08",
              secondary:  palette.surface || palette.secondary  || "#1A1608",
              primary:    palette.primary || "#C9A84C",
              accent:     palette.accent  || "#E8C86A",
              text:       palette.text    || "#FAF7F2",
            },
          } : {}),
        },
      }).catch((e: unknown) => console.warn("DB save:", e));
    }

    return NextResponse.json({
      spec: data, imageData, pollinationsUrl,
      imagePrompt: data.imagePrompt, generatedHtml,
      invitationId, coupleName, eventDate, venue,
    });

  } catch (err) {
    return NextResponse.json(
      { detail: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { generateWithFallback, extractJSON } from "@/lib/ai/gemini";
import { generateSceneImage, buildPollinationsUrl } from "@/lib/ai/imagen";

const SPEC_PROMPT = `You are a world-class wedding invitation creative director and visual artist.
The user describes a wedding theme. You return a JSON spec for a cinematic invitation.
Think: Makoto Shinkai films, Studio Ghibli atmosphere, luxury editorial design.
Be ULTRA specific about colors, fonts, atmosphere. Make every detail intentional.

Return ONLY valid JSON:

{
  "theme": {
    "name": "Evocative theme name (e.g. Sakura Shinobi, Saharan Gold, Midnight Jasmine)",
    "palette": {
      "bg": "#hex — deep atmospheric background matching the scene",
      "surface": "#hex — slightly lighter, for cards/overlays",
      "primary": "#hex — hero accent color (gold, jade, crimson, etc.)",
      "accent": "#hex — secondary color for highlights",
      "text": "#hex — main text (usually near-white or warm cream)",
      "textMuted": "#hex — subtle text"
    },
    "fontHeading": "Most fitting Google Font for the theme (e.g. Amiri, Cinzel, Noto Serif JP, Playfair Display, Scheherazade New, Dancing Script)",
    "fontBody": "Clean readable Google Font (e.g. Jost, Raleway, Nunito, DM Sans)",
    "direction": "ltr or rtl",
    "patternStyle": "arabesque | sakura | stars | geometric | floral | calligraphy | celestial | bamboo | wave"
  },
  "imagePrompt": "CRITICAL: Write a 100-180 word image generation prompt. NO text/words/letters in image. Structure: [Art style] + [Detailed scene description] + [Specific lighting] + [Atmosphere] + [Visual elements from theme] + [Color palette] + [Quality: masterpiece, ultra-detailed, cinematic, 8k, beautiful, emotional]. Characters from behind only, no faces. Be EXTREMELY specific and vivid. Example for Japanese theme: anime cinematic illustration, ancient Japanese village at twilight, paper lanterns glowing orange against purple sky, cherry blossoms swirling, stone bridge over misty river, two silhouettes from behind, Makoto Shinkai style, volumetric god rays, ultra-detailed, masterpiece",
  "coverSpec": {
    "topSymbol": "Most fitting emoji or symbol for the theme (e.g. 🍒 🌙 ⚔️ 🌸 🕌 ✦ 🏮 🌺)",
    "petalEmoji": "Floating particle emoji matching theme (e.g. 🌸 ❄️ 🍂 ✨ 🌟 💫 🌺)",
    "tagline": "Short poetic invitation line (max 8 words, theme-specific)",
    "storyLabel": "Label for story section (e.g. Our Journey, The Mission, Our Path)",
    "storyEmoji": "Story section emoji (e.g. ♥ ⚔️ 🌙 🌸)",
    "storyText": "2-3 sentences of romantic poetic story about the couple, deeply inspired by the theme. No {{GUEST_NAME}}.",
    "detailsLabel": "Label for details section (e.g. The Ceremony, The Mission Briefing, The Grand Celebration)",
    "venueIcon": "Emoji for venue that fits theme (e.g. 🏯 🕌 🌴 ⛩️ 🏰 🌹)",
    "messageEmoji": "Message section emoji",
    "messageTitle": "Title for message section (e.g. Leave a Wish, Your Blessing, Send Your Love)",
    "thankEmoji": "Thank you emoji"
  },
  "envelope": {
    "sealSymbol": "Theme-appropriate seal symbol",
    "sealColor": "#hex matching primary",
    "openingEffect": "cherry_blossoms | gold_sparks | stars | rose_petals | fireflies | snow | leaves"
  },
  "sections": [
    {
      "type": "hero",
      "layout": "cinematic",
      "heading": "Main heading — couple names or theme title",
      "subheading": "Date line or venue teaser",
      "quote": "Poetic quote deeply inspired by the theme (2 lines max)",
      "animation": "fadeIn"
    },
    {
      "type": "welcome",
      "heading": "Welcome heading in theme language",
      "message": "Warm 2-3 sentence welcome from couple to guests. Theme-specific language. No {{GUEST_NAME}}."
    },
    {
      "type": "guest",
      "heading": "Personal greeting heading",
      "message": "Personal message to {{GUEST_NAME}} — use exactly this placeholder once."
    },
    {
      "type": "venue",
      "heading": "Venue section heading",
      "venueName": "Venue display name",
      "venueDescription": "1-2 sentences describing the venue atmosphere in the theme's language",
      "time": "Event time",
      "dresscode": "Optional dress code suggestion matching theme (e.g. Traditional Japanese, White & Gold, Ninja-inspired elegance)"
    },
    {
      "type": "message",
      "heading": "Message section heading",
      "placeholder": "Placeholder text for message input, theme-specific",
      "submitLabel": "Submit button text, theme-specific (e.g. Send with Love ♡, Deliver the Scroll, Cast the Spell)"
    }
  ]
}`;`;
`;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ detail: "Invalid body" }, { status: 400 }); }

  const {
    invitationId, coupleName, eventDate, venue,
    language = "en", style = "luxury",
    culturalBackground = "", additionalDetails = "",
    guestName = "",
  } = body as Record<string, string>;

  const userPrompt = `
Wedding details:
- Couple: ${coupleName}
- Date: ${new Date(eventDate).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
- Venue: ${venue}
- Cultural background: ${culturalBackground || style}
- Language: ${language}
- Additional details: ${additionalDetails}
- Guest name: ${guestName || "Guest"}

Based on this, generate a detailed design specification JSON.
Make the design deeply authentic to the cultural background.
For Tunisian/Arabic: use Amiri or Scheherazade New font, arabesque patterns, warm gold and blue palette, RTL if Arabic language.
All section texts should be in the specified language (${language}).
`;

  try {
    const raw  = await generateWithFallback(`${SPEC_PROMPT}\n\n${userPrompt}`, { temperature: 1.0 });
    const data = extractJSON(raw) as { imagePrompt?: string; [key: string]: unknown };

    // Generate background image URL using Pollinations.ai Flux model
    // (Imagen 3 requires Vertex AI service account, not API key)
    let imageData: string | null = null;
    let pollinationsUrl: string | null = null;

    if (data.imagePrompt) {
      imageData = await generateSceneImage(data.imagePrompt); // returns null (Vertex AI needed)
      pollinationsUrl = buildPollinationsUrl(data.imagePrompt); // always works in browser
    }

    // Save directly to DB so invitation page picks it up immediately
    // Extract color palette from spec for invitation theming
    const specTheme = (data as { theme?: { palette?: Record<string, string> } }).theme;
    const palette = specTheme?.palette;

    const generatedHtml = JSON.stringify({
      __cinematic: true,
      __spec:      true,
      spec:        data,
      imageData:   imageData       || null,
      pollinationsUrl: pollinationsUrl || null,
      imagePrompt: data.imagePrompt || null,
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
      }).catch((e: unknown) => console.warn("DB save failed:", e));
    }

    return NextResponse.json({
      spec: data,
      imageData,
      pollinationsUrl,
      imagePrompt: data.imagePrompt,
      generatedHtml,
      invitationId, coupleName, eventDate, venue, guestName,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Design generation failed";
    return NextResponse.json({ detail: msg }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback, extractJSON } from "@/lib/ai/gemini";

const SPEC_PROMPT = `You are a luxury wedding invitation creative director.
The user describes a wedding. You return a JSON design specification.
The spec drives a rich React component that renders a truly unique invitation.

Return ONLY valid JSON — no markdown, no explanation:

{
  "theme": {
    "name": "Theme name",
    "palette": {
      "bg": "#hex — deep rich background",
      "surface": "#hex — slightly lighter surface",
      "primary": "#hex — main accent (gold, jewel tone)",
      "accent": "#hex — secondary accent",
      "text": "#hex — main text color",
      "textMuted": "#hex — muted text"
    },
    "fontHeading": "Google Font for headings (e.g. Amiri, Cormorant Garamond, Scheherazade New)",
    "fontBody": "Google Font for body (e.g. Jost, Raleway, DM Sans)",
    "direction": "ltr or rtl",
    "patternStyle": "arabesque | mosaic | floral | geometric | minimal | calligraphy"
  },
  "envelope": {
    "sealSymbol": "Unicode symbol for wax seal (e.g. ✦ ❋ ✿ ❁ ☽)",
    "sealColor": "#hex",
    "liningPattern": "arabesque | floral | geometric | plain",
    "openingEffect": "jasmine | petals | sparkles | birds | leaves"
  },
  "sections": [
    {
      "type": "hero",
      "layout": "cinematic | split | centered | fullbleed | arch",
      "heading": "Main heading text",
      "subheading": "Subheading text",
      "quote": "Optional poetic quote",
      "animation": "fadeIn | slideUp | typewriter | reveal | float"
    },
    {
      "type": "countdown",
      "style": "sandclock | arabic_numbers | ornamental | minimal | candles",
      "label": "Label above countdown",
      "datetime": "ISO date string"
    },
    {
      "type": "welcome",
      "heading": "Welcome heading",
      "message": "Warm welcoming message from couple to guests (2-3 sentences)",
      "layout": "centered | card | scroll"
    },
    {
      "type": "guest",
      "heading": "Guest greeting heading",
      "message": "Personalized greeting message (use {{GUEST_NAME}} as placeholder)",
      "layout": "royal | elegant | warm"
    },
    {
      "type": "venue",
      "heading": "Venue section heading",
      "venueName": "Venue name",
      "venueDescription": "2 sentences describing the venue atmosphere",
      "time": "Event time",
      "dresscode": "Dress code if any",
      "mapStyle": "card | elegant | minimal"
    },
    {
      "type": "message",
      "heading": "Leave a message heading",
      "placeholder": "Message input placeholder text",
      "submitLabel": "Submit button text"
    }
  ],
  "decorations": {
    "floatingElements": ["element1", "element2", "element3"],
    "borderStyle": "arabesque | floral | geometric | arch | none",
    "dividerStyle": "ornate | simple | floral | calligraphy",
    "backgroundPattern": "Description of the CSS pattern to use"
  },
  "music": {
    "genre": "Oriental oud | Andalusian | Classical Arabic | Tunisian malouf | French romantic | Piano",
    "mood": "romantic | festive | peaceful | majestic",
    "autoplay": true
  },
  "openingEffect": {
    "type": "envelope",
    "particleType": "jasmine | rose | confetti | sparkles | leaves",
    "particleCount": 30,
    "particleEmoji": "✿",
    "particleColors": ["#fff", "#f5e6c8", "#c9a84c"]
  }
}`;

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
    const spec = extractJSON(raw);
    return NextResponse.json({ spec, invitationId, coupleName, eventDate, venue, guestName });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Design generation failed";
    return NextResponse.json({ detail: msg }, { status: 500 });
  }
}

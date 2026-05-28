import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai/gemini";

const DESIGN_PROMPT = `You are a world-class wedding invitation designer AND front-end engineer.
The user describes a wedding style, cultural background, and provides details.
Your job: generate a COMPLETE, UNIQUE, SELF-CONTAINED HTML invitation page.

The HTML must:
- Be a single file with embedded CSS and vanilla JS
- Feel like a premium product — NOT a generic template
- Have a unique layout invented for this specific request
- Include real animations using CSS keyframes and/or vanilla JS
- Have a real countdown timer (JS)
- Have a working RSVP form (POST to /api/rsvp/INVITATION_ID)
- Load Google Fonts via @import
- Be mobile-first and responsive
- Feel emotionally powerful and culturally authentic

WIDGET IDEAS to mix and match based on the style:
- Envelope opening animation (CSS 3D flip)
- Falling petals / particles (JS canvas or CSS)
- Parallax scrolling sections
- Animated Arabic calligraphy reveal
- Moroccan/Tunisian tile pattern borders (CSS clip-path)
- Wax seal click-to-open
- Cinematic full-bleed photo section (use placeholder if no photo)
- Floating lanterns animation
- Gold shimmer text effect
- Split-screen couple reveal
- Horizontal scroll timeline
- Accordion ceremony details
- Animated countdown with ornamental frames
- Typewriter invitation text effect
- Quote reveal on scroll (Intersection Observer)
- Map embed section
- Photo gallery grid with lightbox
- Confetti burst on RSVP confirmation
- Sound wave music player UI

IMPORTANT RULES:
1. The layout must be UNIQUE to this request — invent it, don't use a standard top-to-bottom scroll
2. Use CSS custom properties for the color palette
3. Include at least 3 distinct JS animations
4. The RSVP form must show a beautiful confirmation state
5. Include a floating music toggle button (UI only — no actual audio src needed)
6. Add INVITATION_ID as a placeholder in RSVP fetch URL: /api/rsvp/INVITATION_ID
7. Replace COUPLE_NAMES, EVENT_DATE, VENUE, GUEST_NAME with actual values from the request
8. Output ONLY the raw HTML — no markdown, no explanation, nothing before <!DOCTYPE or after </html>`;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ detail: "Invalid body" }, { status: 400 }); }

  const {
    invitationId, coupleName, eventDate, venue, language = "en",
    style = "luxury", culturalBackground = "", additionalDetails = "",
    guestName = "", photos = [],
  } = body as Record<string, string>;

  const photoContext = (photos as string[]).length > 0
    ? `The user has provided ${(photos as string[]).length} photo(s). Use img tags with src="${(photos as string[]).join('", "')}" for the couple photos.`
    : `No photos provided. Use beautiful CSS gradient/pattern placeholders styled to match the theme.`;

  const userPrompt = `
Design a premium wedding invitation with these specifics:
- Couple: ${coupleName}
- Date: ${new Date(eventDate).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
- Venue: ${venue}
- Cultural background / style: ${culturalBackground || style}
- Language: ${language}
- Additional details: ${additionalDetails || "None"}
- Guest name (personalize for): ${guestName || "Guest"}
- Invitation ID for RSVP: ${invitationId}
${photoContext}

Create a completely unique, emotionally powerful, culturally authentic invitation.
Make it feel like a luxury product. Invent a layout that perfectly matches the cultural aesthetic.
`;

  try {
    const html = await generateWithFallback(
      `${DESIGN_PROMPT}\n\n${userPrompt}`,
      { temperature: 1.1 }
    );

    // Clean up any markdown wrapping
    const clean = html
      .replace(/^```html\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return NextResponse.json({ html: clean });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Design generation failed";
    return NextResponse.json({ detail: msg }, { status: 500 });
  }
}

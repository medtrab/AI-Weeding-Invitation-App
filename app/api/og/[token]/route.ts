import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";

interface Params { params: Promise<{ token: string }> }

// Generate a beautiful SVG-based OG preview image per guest
// Returns SVG as image/svg+xml (WhatsApp and most platforms render it)
export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params;

  const guest = await db.guest.findUnique({
    where: { token },
    include: {
      invitation: {
        select: {
          coupleName: true, title: true, venue: true, eventDate: true,
          colorPalette: true,
        },
      },
    },
  });

  if (!guest) {
    return new NextResponse("Not found", { status: 404 });
  }

  const inv  = guest.invitation;
  const p    = inv.colorPalette as { primary: string; background: string; text: string };
  const name = guest.name;
  const couple = inv.coupleName || inv.title;
  const date = new Date(inv.eventDate).toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric",
  });

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.background || "#0D0B08"}"/>
      <stop offset="100%" stop-color="#1a1208"/>
    </linearGradient>
    <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="50%" stop-color="${p.primary || "#C9A84C"}"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Gold border frame -->
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="${p.primary || "#C9A84C"}" stroke-width="1" opacity="0.3"/>
  <rect x="36" y="36" width="1128" height="558" fill="none" stroke="${p.primary || "#C9A84C"}" stroke-width="0.5" opacity="0.15"/>

  <!-- Corner ornaments -->
  <text x="50" y="80"  font-size="28" fill="${p.primary || "#C9A84C"}" opacity="0.5" font-family="serif">✦</text>
  <text x="1126" y="80"  font-size="28" fill="${p.primary || "#C9A84C"}" opacity="0.5" font-family="serif">✦</text>
  <text x="50"  y="610" font-size="28" fill="${p.primary || "#C9A84C"}" opacity="0.5" font-family="serif">✦</text>
  <text x="1126" y="610" font-size="28" fill="${p.primary || "#C9A84C"}" opacity="0.5" font-family="serif">✦</text>

  <!-- Jasmine flowers decorative -->
  <text x="580" y="120" font-size="32" text-anchor="middle" font-family="serif" fill="white" opacity="0.15">✿ ❀ ✿</text>

  <!-- "Dear" label -->
  <text x="600" y="200" text-anchor="middle" font-family="Georgia, serif" font-size="18"
    fill="${p.primary || "#C9A84C"}" letter-spacing="6" opacity="0.7">DEAR</text>

  <!-- Guest name — large and personal -->
  <text x="600" y="290" text-anchor="middle" font-family="Georgia, serif" font-size="72"
    font-weight="300" fill="${p.text || "#FAF7F2"}">${escapeXml(name)}</text>

  <!-- Gold divider -->
  <rect x="300" y="310" width="600" height="1" fill="url(#goldLine)"/>
  <text x="600" y="335" text-anchor="middle" font-size="16" fill="${p.primary || "#C9A84C"}" opacity="0.6">◆</text>

  <!-- Invitation text -->
  <text x="600" y="385" text-anchor="middle" font-family="Georgia, serif" font-size="22"
    font-style="italic" fill="${p.text || "#FAF7F2"}" opacity="0.75">You are cordially invited to celebrate</text>

  <!-- Couple name -->
  <text x="600" y="445" text-anchor="middle" font-family="Georgia, serif" font-size="46"
    fill="${p.primary || "#C9A84C"}" font-style="italic">${escapeXml(couple)}</text>

  <!-- Date & venue -->
  <text x="600" y="505" text-anchor="middle" font-family="Georgia, serif" font-size="18"
    fill="${p.text || "#FAF7F2"}" opacity="0.55" letter-spacing="2">${escapeXml(date)}</text>
  <text x="600" y="535" text-anchor="middle" font-family="Georgia, serif" font-size="16"
    fill="${p.primary || "#C9A84C"}" opacity="0.5">${escapeXml(inv.venue)}</text>

  <!-- Bottom tag -->
  <text x="600" y="590" text-anchor="middle" font-family="Georgia, serif" font-size="13"
    fill="${p.primary || "#C9A84C"}" opacity="0.4" letter-spacing="4">✦ TAP TO OPEN YOUR INVITATION ✦</text>
</svg>`.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

import { notFound }    from "next/navigation";
import { db }          from "@/lib/db/client";
import { InvitationRenderer }  from "@/components/invitation/InvitationRenderer";
import { SpecViewerPage }      from "@/components/invitation/generated/SpecViewerPage";
import { TreasureBoxTemplate }  from "@/components/invitation/templates/TreasureBoxTemplate";
import { CinematicTemplate }    from "@/components/invitation/templates/CinematicTemplate";
import type { Metadata }  from "next";
import type { Invitation } from "@/types";

interface Props {
  params:       Promise<{ slug: string }>;
  searchParams: Promise<{ g?: string; guest?: string; template?: string }>;
}

// ── Dynamic metadata (OG) per guest ──────────────────────────────────────
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug }              = await params;
  const { g: token, guest: legacyGuest } = await searchParams;

  const inv = await db.invitation.findUnique({
    where: { slug },
    select: { title: true, coupleName: true, venue: true, eventDate: true, slug: true },
  });
  if (!inv) return { title: "Invitation" };

  const couple    = inv.coupleName || inv.title;
  const base      = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXTAUTH_URL?.startsWith("http://localhost")
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "ai-weeding-invitation-app.vercel.app"}`
      : process.env.NEXTAUTH_URL || "https://ai-weeding-invitation-app.vercel.app";
  const pageUrl   = `${base}/i/${slug}${token ? `?g=${token}` : ""}`;

  // Resolve guest name
  let guestName = legacyGuest ? decodeURIComponent(legacyGuest) : undefined;
  if (token) {
    const guest = await db.guest.findUnique({ where: { token }, select: { name: true } });
    if (guest) guestName = guest.name;
  }

  const title = guestName
    ? `${guestName} — You're invited to ${couple}`
    : `You're invited — ${couple}`;
  const description = `Join us for a magical evening at ${inv.venue}`;

  // OG image — personalized if token, generic if not
  const ogImage = token
    ? `${base}/api/og/${token}`
    : `${base}/api/og/default?slug=${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url:    pageUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type:   "website",
    },
    twitter: {
      card:        "summary_large_image",
      title,
      description,
      images:      [ogImage],
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────
export default async function InvitationViewerPage({ params, searchParams }: Props) {
  const { slug }                           = await params;
  const { g: token, guest: legacyGuest, template } = await searchParams;

  const invitation = await db.invitation.findFirst({
    where: { slug, status: "published" },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!invitation) notFound();

  // Resolve guest name from token or legacy ?guest= param
  let guestName = legacyGuest ? decodeURIComponent(legacyGuest) : undefined;
  if (token) {
    const guest = await db.guest.findUnique({ where: { token }, select: { name: true } });
    if (guest) guestName = guest.name;
  }

  const inv = JSON.parse(JSON.stringify(invitation)) as Invitation & { generatedHtml?: string };

  const isTreasure = template === "treasure" || inv.animationStyle === "treasure_box";
  if (isTreasure) {
    return (
      <>
        {/* Tracking pixel */}
        {token && <TrackingPixel token={token} event="opened" />}
        <TreasureBoxTemplate
          invitation={inv}
          guestName={guestName}
          songLabel={inv.musicLabel ?? undefined}
          songUrl={inv.musicUrl ?? undefined}
          trackingToken={token}
        />
      </>
    );
  }

  try {
    if (inv.generatedHtml) {
      const parsed = JSON.parse(inv.generatedHtml);
      
      // Cinematic template with AI-generated background image
      if (parsed.__cinematic) {
        // imageUrl: use base64 from Imagen3, OR the Pollinations URL directly
        // imagePrompt: only used as fallback if no URL at all
        const bgImageUrl = parsed.imageData || parsed.pollinationsUrl || undefined;
        return (
          <>
            {token && <TrackingPixel token={token} event="opened" />}
            <CinematicTemplate
              invitation={inv}
              guestName={guestName}
              imageUrl={bgImageUrl}
              trackingToken={token}
            />
          </>
        );
      }
      
      if (parsed.__spec) {
        return (
          <>
            {token && <TrackingPixel token={token} event="opened" />}
            <SpecViewerPage
              spec={parsed.spec}
              coupleName={inv.coupleName ?? inv.title}
              eventDate={inv.eventDate}
              venue={inv.venue}
              guestName={guestName}
              photos={parsed.photos ?? []}
            />
          </>
        );
      }
    }
  } catch {}

  return (
    <>
      {token && <TrackingPixel token={token} event="opened" />}
      <InvitationRenderer invitation={inv} guestName={guestName} trackingToken={token} />
    </>
  );
}

// ── Server-side tracking pixel ────────────────────────────────────────────
async function TrackingPixel({ token, event }: { token: string; event: string }) {
  // Fire-and-forget server action to track the open
  try {
    const guest = await db.guest.findUnique({ where: { token } });
    if (guest) {
      await db.guestAnalytic.create({
        data: { guestId: guest.id, invitationId: guest.invitationId, event },
      });
    }
  } catch {}
  return null;
}

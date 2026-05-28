import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { SpecViewerPage } from "@/components/invitation/generated/SpecViewerPage";
import type { Metadata } from "next";
import type { Invitation } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ guest?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const inv = await db.invitation.findUnique({ where: { slug }, select: { title: true, venue: true, coupleName: true } });
  if (!inv) return { title: "Invitation Not Found" };
  return { title: inv.title, description: `You're invited to ${inv.coupleName ?? inv.title} at ${inv.venue}` };
}

export default async function InvitationViewerPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { guest } = await searchParams;

  const invitation = await db.invitation.findFirst({
    where: { slug, status: "published" },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!invitation) notFound();

  const inv = JSON.parse(JSON.stringify(invitation)) as Invitation & { generatedHtml?: string };
  const guestName = guest ? decodeURIComponent(guest) : undefined;

  // Check for spec-based design
  try {
    if (inv.generatedHtml) {
      const parsed = JSON.parse(inv.generatedHtml);
      if (parsed.__spec) {
        return (
          <SpecViewerPage
            spec={parsed.spec}
            coupleName={inv.coupleName ?? inv.title}
            eventDate={inv.eventDate}
            venue={inv.venue}
            guestName={guestName}
            photos={parsed.photos ?? []}
          />
        );
      }
    }
  } catch {}

  return <InvitationRenderer invitation={inv} guestName={guestName} />;
}

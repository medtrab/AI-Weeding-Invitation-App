import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { GeneratedInvitation } from "@/components/invitation/generated/GeneratedInvitation";
import type { Metadata } from "next";
import type { Invitation } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ guest?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const inv = await db.invitation.findUnique({
    where: { slug },
    select: { title: true, venue: true, coupleName: true },
  });
  if (!inv) return { title: "Invitation Not Found" };
  return {
    title: inv.title,
    description: `You're invited to ${inv.coupleName ?? inv.title} at ${inv.venue}`,
    openGraph: { title: inv.title, description: `A special invitation for you`, type: "website" },
  };
}

export default async function InvitationViewerPage({ params, searchParams }: Props) {
  const { slug }  = await params;
  const { guest } = await searchParams;

  const invitation = await db.invitation.findFirst({
    where: { slug, status: "published" },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!invitation) notFound();

  const guestName = guest ? decodeURIComponent(guest) : undefined;
  const inv = JSON.parse(JSON.stringify(invitation)) as Invitation & { generatedHtml?: string };

  // If AI generated a unique HTML design, show that
  if (inv.generatedHtml) {
    // Personalise guest name in generated HTML
    const personalized = guestName
      ? inv.generatedHtml.replace(/GUEST_NAME/g, guestName)
      : inv.generatedHtml;

    return <GeneratedInvitation html={personalized} className="min-h-screen" />;
  }

  // Otherwise use the standard renderer
  return (
    <InvitationRenderer
      invitation={inv}
      guestName={guestName}
    />
  );
}

import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import type { Metadata } from "next";
import type { Invitation } from "@/types";

interface Props { params: { slug: string }; searchParams: { guest?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const inv = await db.invitation.findUnique({
    where: { slug: params.slug },
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
  const invitation = await db.invitation.findFirst({
    where: { slug: params.slug, status: "published" },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!invitation) notFound();

  const guestName = searchParams.guest ? decodeURIComponent(searchParams.guest) : undefined;

  return (
    <InvitationRenderer
      invitation={JSON.parse(JSON.stringify(invitation)) as Invitation}
      guestName={guestName}
    />
  );
}

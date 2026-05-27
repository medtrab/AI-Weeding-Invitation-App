import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import type { Metadata } from "next";

interface Props { params: { slug: string }; searchParams: { guest?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const invitation = await db.invitation.findUnique({ where: { slug: params.slug }, select: { title: true, venue: true } });
  if (!invitation) return { title: "Invitation Not Found" };
  return { title: invitation.title, description: `You're invited to ${invitation.title} at ${invitation.venue}` };
}

export default async function InvitationViewerPage({ params, searchParams }: Props) {
  const invitation = await db.invitation.findFirst({
    where: { slug: params.slug, status: "published" },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!invitation) notFound();

  const guestName = searchParams.guest ? decodeURIComponent(searchParams.guest) : undefined;
  const palette = invitation.colorPalette as { primary: string; secondary: string; accent: string; background: string; text: string };

  return (
    <div style={{ backgroundColor: palette.background, color: palette.text, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(invitation.fontPrimary)}:ital,wght@0,300;0,400;1,400&family=${encodeURIComponent(invitation.fontSecondary)}:wght@300;400&display=swap');
        .inv-heading { font-family: '${invitation.fontPrimary}', serif; }
        .inv-body { font-family: '${invitation.fontSecondary}', sans-serif; }
      `}</style>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-8">
        {guestName && (
          <p className="text-xs uppercase tracking-[0.3em] mb-6 inv-body" style={{ color: palette.primary, opacity: 0.7 }}>
            A special invitation for {guestName}
          </p>
        )}
        <h1 className="inv-heading text-6xl font-light mb-4">
          {invitation.coupleName ?? invitation.title}
        </h1>
        <div style={{ width: 40, height: 1, background: palette.primary, margin: "1.5rem auto", opacity: 0.5 }} />
        <p className="inv-body text-sm uppercase tracking-[0.2em] mb-2" style={{ opacity: 0.5 }}>
          {new Date(invitation.eventDate).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
        </p>
        <p className="inv-body text-sm" style={{ opacity: 0.6 }}>{invitation.venue}</p>
      </div>
    </div>
  );
}

import { notFound, redirect } from "next/navigation";
import { getServerSession }   from "next-auth";
import { authOptions }        from "@/lib/auth/config";
import { db }                 from "@/lib/db/client";
import { CinematicTemplate }  from "@/components/invitation/templates/CinematicTemplate";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { SpecViewerPage }     from "@/components/invitation/generated/SpecViewerPage";
import type { Invitation }    from "@/types";

interface Props { params: Promise<{ invitationId: string }> }

export default async function BuilderPreviewPage({ params }: Props) {
  const { invitationId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const userId = (session.user as { id: string }).id;

  const invitation = await db.invitation.findFirst({
    where: { id: invitationId, userId },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!invitation) notFound();

  const inv = JSON.parse(JSON.stringify(invitation)) as Invitation & { generatedHtml?: string };

  // Same routing as public page but without auth gate
  if (inv.generatedHtml) {
    try {
      const parsed = JSON.parse(inv.generatedHtml);
      if (parsed.__cinematic) {
        const bgImageUrl = parsed.imageData || parsed.pollinationsUrl || undefined;
        return (
          <div>
            <div className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-sm border-b border-gold/20 px-4 py-2 flex items-center justify-between">
              <span className="text-xs text-gold/70 uppercase tracking-[0.2em]">🔍 Preview Mode — not public</span>
              <a href={`/builder/${invitationId}`}
                className="text-xs text-cream/50 hover:text-cream transition-colors">← Back to Builder</a>
            </div>
            <div className="pt-10">
              <CinematicTemplate invitation={inv} imageUrl={bgImageUrl} />
            </div>
          </div>
        );
      }
      if (parsed.__spec) {
        return (
          <div>
            <div className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-sm border-b border-gold/20 px-4 py-2 flex items-center justify-between">
              <span className="text-xs text-gold/70 uppercase tracking-[0.2em]">🔍 Preview Mode</span>
              <a href={`/builder/${invitationId}`} className="text-xs text-cream/50 hover:text-cream">← Back</a>
            </div>
            <div className="pt-10">
              <SpecViewerPage spec={parsed.spec} coupleName={inv.coupleName ?? inv.title}
                eventDate={inv.eventDate} venue={inv.venue} photos={parsed.photos ?? []} />
            </div>
          </div>
        );
      }
    } catch {}
  }

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-sm border-b border-gold/20 px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-gold/70 uppercase tracking-[0.2em]">🔍 Preview Mode</span>
        <a href={`/builder/${invitationId}`} className="text-xs text-cream/50 hover:text-cream">← Back</a>
      </div>
      <div className="pt-10">
        <InvitationRenderer invitation={inv} isPreview={false} />
      </div>
    </div>
  );
}

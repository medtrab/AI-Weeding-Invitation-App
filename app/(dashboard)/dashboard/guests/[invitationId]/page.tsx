import { redirect, notFound } from "next/navigation";
import { getServerSession }   from "next-auth";
import { authOptions }        from "@/lib/auth/config";
import { db }                 from "@/lib/db/client";
import { GuestDashboard }     from "@/components/dashboard/guests/GuestDashboard";

interface Props { params: Promise<{ invitationId: string }> }

export async function generateMetadata({ params }: Props) {
  const { invitationId } = await params;
  const inv = await db.invitation.findUnique({ where: { id: invitationId }, select: { title: true, coupleName: true } });
  return { title: `Guests · ${inv?.coupleName || inv?.title || "Invitation"}` };
}

export default async function GuestsPage({ params }: Props) {
  const { invitationId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const userId = (session.user as { id: string }).id;

  const invitation = await db.invitation.findFirst({
    where: { id: invitationId, userId },
    include: {
      guests: {
        include: { analytics: { orderBy: { createdAt: "desc" }, take: 5 } },
        orderBy: [{ isVip: "desc" }, { createdAt: "asc" }],
      },
    },
  });
  if (!invitation) notFound();

  return <GuestDashboard invitation={JSON.parse(JSON.stringify(invitation))} />;
}

import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RSVPTable } from "@/components/dashboard/RSVPTable";
import Link from "next/link";

interface Props {
  params: Promise<{ invitationId: string }>;
}

export default async function GuestsPage({ params }: Props) {
  const { invitationId } = await params;

  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const invitation = await db.invitation.findFirst({
    where: { id: invitationId, userId: (session.user as { id: string }).id },
    select: { id: true, title: true, coupleName: true },
  });
  if (!invitation) notFound();

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="text-cream/30 hover:text-cream/70 text-sm transition-colors">← Dashboard</Link>
          <span className="text-cream/20">/</span>
          <h1 className="font-cormorant text-3xl font-light text-cream">
            {invitation.coupleName ?? invitation.title} — Guests
          </h1>
        </div>
        <RSVPTable invitationId={invitationId} />
      </div>
    </DashboardLayout>
  );
}

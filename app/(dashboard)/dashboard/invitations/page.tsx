import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { InvitationCard } from "@/components/dashboard/InvitationCard";
import Link from "next/link";
import type { Invitation } from "@/types";

export const metadata = { title: "Invitations" };

export default async function InvitationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const invitations = await db.invitation.findMany({
    where: { userId: (session.user as { id: string }).id },
    orderBy: { updatedAt: "desc" },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-cormorant text-3xl font-light text-cream mb-1">All Invitations</h1>
            <p className="text-sm text-cream/40">{invitations.length} invitation{invitations.length !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/builder/new" className="px-6 py-3 bg-gold text-deep text-[11px] uppercase tracking-[0.2em] hover:bg-gold-light transition-colors">
            + New Invitation
          </Link>
        </div>

        {invitations.length === 0 ? (
          <div className="border border-dashed border-gold/15 p-16 text-center">
            <p className="font-cormorant text-2xl font-light text-cream/50 mb-6">No invitations yet</p>
            <Link href="/builder/new" className="inline-block px-8 py-3 bg-gold text-deep text-xs uppercase tracking-[0.2em] hover:bg-gold-light transition-colors">
              Create Your First Invitation
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {invitations.map((inv) => (
              <InvitationCard key={inv.id} invitation={JSON.parse(JSON.stringify(inv)) as Invitation} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

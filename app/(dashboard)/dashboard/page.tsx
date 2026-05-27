import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { InvitationCard } from "@/components/dashboard/InvitationCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart2, Send, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { Invitation } from "@/types";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as { id: string }).id;

  const [invitations, rsvpCount] = await Promise.all([
    db.invitation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { sections: { orderBy: { order: "asc" } } },
    }),
    db.rSVP.count({
      where: { invitation: { userId } },
    }),
  ]);

  const published = invitations.filter((i) => i.status === "published").length;
  const recent    = invitations.slice(0, 4);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl">
        <div className="mb-10">
          <h1 className="font-cormorant text-3xl font-light text-cream mb-1">Your Dashboard</h1>
          <p className="text-sm text-cream/40 tracking-wide">Welcome back, {session.user?.name?.split(" ")[0]}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
          <StatCard label="Total Invitations" value={invitations.length} icon={BarChart2} />
          <StatCard label="Published" value={published} icon={Send} />
          <StatCard label="Total RSVPs" value={rsvpCount} icon={Users} />
          <StatCard label="Conversion" value={invitations.length ? `${Math.round((published / invitations.length) * 100)}%` : "—"} icon={TrendingUp} />
        </div>

        {/* Recent invitations */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-cormorant text-xl font-light text-cream">Recent Invitations</h2>
          <Link href="/dashboard/invitations" className="text-xs uppercase tracking-[0.15em] text-gold/60 hover:text-gold transition-colors">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="border border-dashed border-gold/15 p-16 text-center max-w-lg">
            <p className="font-cormorant text-2xl font-light text-cream/50 mb-2">No invitations yet</p>
            <p className="text-sm text-cream/30 mb-6">Create your first AI-powered invitation</p>
            <Link href="/builder/new" className="inline-block px-8 py-3 bg-gold text-deep text-xs uppercase tracking-[0.2em] hover:bg-gold-light transition-colors">
              Create Invitation
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {recent.map((inv) => (
              <InvitationCard key={inv.id} invitation={JSON.parse(JSON.stringify(inv)) as Invitation} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

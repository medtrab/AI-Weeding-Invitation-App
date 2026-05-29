import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const userId = (session.user as { id: string }).id;

  const invitations = await db.invitation.findMany({
    where: { userId },
    select: { id: true, title: true, coupleName: true, _count: { select: { rsvps: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const chartData = invitations.map((inv: { coupleName: string | null; title: string; _count: { rsvps: number } }) => ({
    label: (inv.coupleName ?? inv.title).split(" ")[0],
    attending: Math.floor(Math.random() * inv._count.rsvps),
    declined:  Math.floor(Math.random() * inv._count.rsvps * 0.3),
  }));

  const totalRSVPs = invitations.reduce((acc: number, i: { _count: { rsvps: number } }) => acc + i._count.rsvps, 0);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl">
        <h1 className="font-cormorant text-3xl font-light text-cream mb-8">Analytics</h1>
        <div className="grid md:grid-cols-3 gap-3 mb-10">
          {[
            { label: "Total Invitations", value: invitations.length },
            { label: "Total RSVPs",        value: totalRSVPs },
            { label: "Avg per Invitation", value: invitations.length ? Math.round(totalRSVPs / invitations.length) : 0 },
          ].map((s) => (
            <div key={s.label} className="bg-gold/[0.04] border border-gold/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-1">{s.label}</p>
              <p className="font-cormorant text-4xl font-light text-cream">{s.value}</p>
            </div>
          ))}
        </div>
        <AnalyticsChart data={chartData} />
      </div>
    </DashboardLayout>
  );
}

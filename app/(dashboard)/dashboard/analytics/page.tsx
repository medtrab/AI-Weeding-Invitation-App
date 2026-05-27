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

  const chartData = invitations.map((inv) => ({
    label: (inv.coupleName ?? inv.title).split(" ")[0],
    attending: Math.floor(Math.random() * inv._count.rsvps),
    declined:  Math.floor(Math.random() * inv._count.rsvps * 0.3),
  }));

  const totalRSVPs = invitations.reduce((acc, i) => acc + i._count.rsvps, 0);

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
            <div key={s.label} className="bg-[#0D0B08] border border-gold/10 p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cream/35 mb-2">{s.label}</p>
              <p className="font-cormorant text-3xl font-light text-cream">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#0D0B08] border border-gold/10 p-6">
          <AnalyticsChart data={chartData} />
        </div>

        {invitations.length > 0 && (
          <div className="mt-8">
            <h2 className="font-cormorant text-xl font-light text-cream mb-4">Invitation Breakdown</h2>
            <div className="border border-gold/10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/10">
                    {["Invitation","RSVPs"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-cream/30 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((inv) => (
                    <tr key={inv.id} className="border-b border-gold/5 hover:bg-gold/[0.02]">
                      <td className="px-4 py-3 text-cream/70">{inv.coupleName ?? inv.title}</td>
                      <td className="px-4 py-3 text-cream/50">{inv._count.rsvps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

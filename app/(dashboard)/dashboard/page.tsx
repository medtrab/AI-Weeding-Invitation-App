import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db/client";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
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
    db.rSVP.count({ where: { invitation: { userId } } }),
  ]);

  const published = invitations.filter((i) => i.status === "published").length;

  return (
    <DashboardClient
      invitations={JSON.parse(JSON.stringify(invitations)) as Invitation[]}
      stats={{
        total: invitations.length,
        published,
        rsvpCount,
        conversion: invitations.length
          ? Math.round((published / invitations.length) * 100)
          : 0,
      }}
      userName={session.user?.name?.split(" ")[0] ?? ""}
    />
  );
}

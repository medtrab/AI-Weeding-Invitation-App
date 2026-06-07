import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db/client";
import { LabClient } from "@/components/dashboard/LabClient";

export const metadata = { title: "Design Lab — Test Prompts" };

export default async function LabPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const userId = (session.user as { id: string }).id;

  const invitations = await db.invitation.findMany({
    where: { userId, status: "published" },
    select: { id: true, title: true, coupleName: true, slug: true, eventDate: true, venue: true },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  return <LabClient invitations={JSON.parse(JSON.stringify(invitations))} />;
}

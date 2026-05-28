import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db/client";
import { InvitationsClient } from "@/components/dashboard/InvitationsClient";
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
    <InvitationsClient
      invitations={JSON.parse(JSON.stringify(invitations)) as Invitation[]}
    />
  );
}

import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db/client";
import { BuilderLayout } from "@/components/builder/BuilderLayout";
import type { Invitation } from "@/types";

export default async function BuilderPage({ params }: { params: { invitationId: string } }) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as { id?: string })?.id) redirect("/login");
  if (params.invitationId === "new") redirect("/dashboard/invitations?create=true");

  const invitation = await db.invitation.findFirst({
    where: { id: params.invitationId, userId: (session!.user as { id: string }).id },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!invitation) notFound();

  return <BuilderLayout invitation={JSON.parse(JSON.stringify(invitation)) as Invitation} />;
}

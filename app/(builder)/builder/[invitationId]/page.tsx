import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db/client";

export default async function BuilderPage({ params }: { params: { invitationId: string } }) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as { id?: string })?.id) redirect("/login");
  if (params.invitationId === "new") redirect("/dashboard?create=true");

  const invitation = await db.invitation.findFirst({
    where: { id: params.invitationId, userId: (session!.user as { id: string }).id },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!invitation) notFound();

  return (
    <div className="fixed inset-0 bg-[#0A0806] flex flex-col">
      <div className="h-14 border-b border-gold/10 bg-[#0D0B08] flex items-center px-4 gap-4">
        <a href="/dashboard" className="text-cream/40 hover:text-cream/80 text-sm transition-colors">← Dashboard</a>
        <span className="text-sm text-cream/60">{invitation.title}</span>
        <div className="flex-1" />
        <button className="px-6 py-2 bg-gold text-deep text-xs uppercase tracking-[0.2em] hover:bg-gold-light transition-colors">Publish</button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="font-cormorant text-2xl font-light text-cream/50 mb-2">Builder for: {invitation.title}</p>
          <p className="text-sm text-cream/30">Full drag-and-drop editor renders here.</p>
        </div>
      </div>
    </div>
  );
}

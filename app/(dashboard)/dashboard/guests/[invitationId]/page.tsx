import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";

export default async function GuestsPage({ params }: { params: { invitationId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <div className="min-h-screen bg-[#080604] p-8">
      <h1 className="font-cormorant text-3xl font-light text-cream mb-8">Guest Responses</h1>
      <p className="text-sm text-cream/40">Invitation ID: {params.invitationId}</p>
    </div>
  );
}

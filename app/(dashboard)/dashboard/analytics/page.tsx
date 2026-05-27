import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <div className="min-h-screen bg-[#080604] p-8">
      <h1 className="font-cormorant text-3xl font-light text-cream mb-8">Analytics</h1>
      <p className="text-sm text-cream/40">RSVP analytics and guest insights will appear here.</p>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <div className="min-h-screen bg-[#080604] flex">
      <aside className="w-60 border-r border-gold/10 bg-[#0D0B08] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gold/10">
          <a href="/" className="font-cormorant text-xl font-light tracking-[0.15em] text-gold uppercase">Invité</a>
        </div>
        <div className="p-4 border-b border-gold/10">
          <a href="/builder/new" className="block w-full text-center py-2.5 bg-gold text-deep text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors">
            + New Invitation
          </a>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {[
            { href:"/dashboard", label:"Overview" },
            { href:"/dashboard/invitations", label:"Invitations" },
            { href:"/dashboard/analytics", label:"Analytics" },
          ].map(({ href, label }) => (
            <a key={href} href={href} className="flex items-center px-4 py-2.5 text-sm text-cream/45 hover:text-cream/80 hover:bg-cream/5 transition-all rounded-sm">
              {label}
            </a>
          ))}
        </nav>
        <div className="border-t border-gold/10 p-4">
          <p className="text-xs text-cream/50 mb-1">{session.user?.name}</p>
          <p className="text-[10px] text-cream/25">{session.user?.email}</p>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="font-cormorant text-3xl font-light text-cream mb-2">Your Dashboard</h1>
        <p className="text-sm text-cream/40">Manage your invitations and guest responses.</p>
        <div className="mt-8 border border-dashed border-gold/15 p-16 text-center max-w-lg">
          <p className="font-cormorant text-2xl font-light text-cream/50 mb-2">No invitations yet</p>
          <p className="text-sm text-cream/30 mb-6">Create your first AI-powered invitation</p>
          <a href="/builder/new" className="inline-block px-8 py-3 bg-gold text-deep text-xs uppercase tracking-[0.2em] hover:bg-gold-light transition-colors">
            Create Invitation
          </a>
        </div>
      </main>
    </div>
  );
}

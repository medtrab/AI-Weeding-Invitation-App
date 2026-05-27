"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, FileText, Users, BarChart2, Settings, LogOut, Plus, Crown } from "lucide-react";
import { ToastContainer } from "@/components/ui/Toast";

const NAV = [
  { href: "/dashboard",              label: "Overview",    icon: LayoutDashboard },
  { href: "/dashboard/invitations",  label: "Invitations", icon: FileText         },
  { href: "/dashboard/guests",       label: "Guests",      icon: Users            },
  { href: "/dashboard/analytics",    label: "Analytics",   icon: BarChart2        },
  { href: "/dashboard/settings",     label: "Settings",    icon: Settings         },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-[#080604]">
      <aside className="w-60 shrink-0 border-r border-gold/10 flex flex-col bg-[#0D0B08]">
        <div className="h-16 flex items-center px-6 border-b border-gold/10">
          <Link href="/" className="font-cormorant text-xl font-light tracking-[0.15em] text-gold uppercase">Invité</Link>
        </div>
        <div className="p-4 border-b border-gold/10">
          <Link href="/builder/new" className="flex items-center justify-center gap-2 w-full py-2.5 bg-gold text-deep text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors">
            <Plus size={13} /> New Invitation
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all border-l-2 ${
                  active ? "text-gold bg-gold/8 border-gold" : "text-cream/45 hover:text-cream/80 hover:bg-cream/5 border-transparent"
                }`}
              >
                <Icon size={15} /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gold/10 p-4">
          {session?.user && (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center text-xs font-medium text-gold">
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-cream/70 truncate">{session.user.name}</p>
                <p className="text-[10px] text-cream/30 truncate">{session.user.email}</p>
              </div>
            </div>
          )}
          <Link href="/dashboard/upgrade" className="flex items-center gap-2 text-xs text-gold/60 hover:text-gold mb-2 transition-colors">
            <Crown size={12} /> Upgrade to Luxe
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 text-xs text-cream/30 hover:text-cream/60 transition-colors">
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
      <ToastContainer />
    </div>
  );
}

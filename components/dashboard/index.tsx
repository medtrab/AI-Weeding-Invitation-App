// components/dashboard/DashboardLayout.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard, FileText, Users, BarChart2,
  Settings, LogOut, Plus, Crown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ToastContainer } from "@/components/ui/Toast";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/invitations", label: "Invitations", icon: FileText },
  { href: "/dashboard/guests", label: "Guests", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-[#080604]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-gold/10 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gold/10">
          <Link
            href="/"
            className="font-cormorant text-xl font-light tracking-[0.15em] text-gold uppercase"
          >
            Invité
          </Link>
        </div>

        {/* New invitation CTA */}
        <div className="p-4 border-b border-gold/10">
          <Link href="/builder/new">
            <Button size="sm" className="w-full gap-2">
              <Plus size={13} />
              New Invitation
            </Button>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                  active
                    ? "text-gold bg-gold/8 border-l-2 border-gold"
                    : "text-cream/45 hover:text-cream/80 hover:bg-cream/5 border-l-2 border-transparent"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User + plan */}
        <div className="border-t border-gold/10 p-4">
          {session?.user && (
            <div className="mb-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center text-xs font-medium text-gold">
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-cream/70 truncate">{session.user.name}</p>
                <p className="text-[10px] text-cream/30 truncate">{session.user.email}</p>
              </div>
            </div>
          )}
          <Link
            href="/dashboard/upgrade"
            className="flex items-center gap-2 text-xs text-gold/60 hover:text-gold mb-2 transition-colors"
          >
            <Crown size={12} /> Upgrade to Luxe
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-xs text-cream/30 hover:text-cream/60 transition-colors"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      <ToastContainer />
    </div>
  );
}


// components/dashboard/DashboardOverview.tsx

"use client";

import { motion } from "framer-motion";
import { useInvitations } from "@/hooks/useInvitations";
import { InvitationCard } from "./InvitationCard";
import { StatCard } from "./StatCard";
import { BarChart2, Users, Send, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function DashboardOverview() {
  const { data: invitations = [], isLoading } = useInvitations();

  const stats = {
    total: invitations.length,
    published: invitations.filter((i) => i.status === "published").length,
    totalRsvps: 0, // populated from server
    avgResponseRate: 0,
  };

  const recent = invitations.slice(0, 4);

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-cormorant text-3xl font-light text-cream mb-1">
          Your Dashboard
        </h1>
        <p className="text-sm text-cream/40 tracking-wide">
          Manage your invitations and guest responses
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {[
          { label: "Total Invitations", value: stats.total, icon: BarChart2 },
          { label: "Published", value: stats.published, icon: Send },
          { label: "Total RSVPs", value: stats.totalRsvps, icon: Users },
          { label: "Avg Response Rate", value: `${stats.avgResponseRate}%`, icon: TrendingUp },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Recent invitations */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-cormorant text-xl font-light text-cream">
          Recent Invitations
        </h2>
        <Link href="/dashboard/invitations">
          <Button variant="text" size="sm">View all →</Button>
        </Link>
      </div>

      {isLoading ? (
        <InvitationGridSkeleton />
      ) : recent.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {recent.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <InvitationCard invitation={inv} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-gold/15 p-16 text-center">
      <p className="font-cormorant text-2xl font-light text-cream/50 mb-2">
        No invitations yet
      </p>
      <p className="text-sm text-cream/30 mb-6">
        Create your first AI-powered invitation
      </p>
      <Link href="/builder/new">
        <Button>Create Invitation</Button>
      </Link>
    </div>
  );
}

function InvitationGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-48 bg-cream/5 border border-gold/10 animate-pulse"
        />
      ))}
    </div>
  );
}


// components/dashboard/InvitationCard.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MoreHorizontal, Edit2, Copy, Trash2,
  Eye, Share2, ExternalLink,
} from "lucide-react";
import { useDeleteInvitation, useDuplicateInvitation } from "@/hooks/useInvitations";
import { useUIStore } from "@/stores/useUIStore";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Invitation } from "@/types";

interface InvitationCardProps {
  invitation: Invitation;
}

const STATUS_STYLES = {
  draft: "border-cream/20 text-cream/40",
  published: "border-emerald-500/40 text-emerald-400",
  archived: "border-cream/10 text-cream/20",
};

const EVENT_EMOJIS: Record<string, string> = {
  wedding: "💍", engagement: "💌", birthday: "🎂",
  corporate: "🏛️", baby_shower: "🍼", graduation: "🎓", vip: "⭐",
};

export function InvitationCard({ invitation }: InvitationCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { mutate: deleteInv } = useDeleteInvitation();
  const { mutate: duplicate } = useDuplicateInvitation();
  const { openModal } = useUIStore();

  return (
    <motion.div
      className="group relative bg-[#0D0B08] border border-gold/10 hover:border-gold/25 transition-all"
      whileHover={{ y: -2 }}
    >
      {/* Color strip */}
      <div
        className="h-1"
        style={{ background: invitation.colorPalette?.primary ?? "#C9A84C" }}
      />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{EVENT_EMOJIS[invitation.eventType] ?? "✦"}</span>
            <div>
              <h3 className="text-sm font-medium text-cream/85 leading-tight">
                {invitation.title}
              </h3>
              {invitation.coupleName && (
                <p className="text-[11px] text-cream/35 mt-0.5">{invitation.coupleName}</p>
              )}
            </div>
          </div>

          {/* Status badge */}
          <span
            className={`text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 border ${
              STATUS_STYLES[invitation.status]
            }`}
          >
            {invitation.status}
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-[11px] text-cream/30 mb-4">
          <span>{new Date(invitation.eventDate).toLocaleDateString()}</span>
          <span>·</span>
          <span className="truncate">{invitation.venue}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/builder/${invitation.id}`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] uppercase tracking-[0.15em] border border-gold/20 text-cream/50 hover:border-gold/50 hover:text-gold transition-all">
              <Edit2 size={11} /> Edit
            </button>
          </Link>

          {invitation.status === "published" && (
            <Link href={`/i/${invitation.slug}`} target="_blank" className="flex-1">
              <button className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] uppercase tracking-[0.15em] border border-gold/20 text-cream/50 hover:border-gold/50 hover:text-gold transition-all">
                <ExternalLink size={11} /> View
              </button>
            </Link>
          )}

          {/* Overflow menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-cream/30 hover:text-cream/70 border border-gold/10 hover:border-gold/30 transition-all"
            >
              <MoreHorizontal size={14} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-1 w-44 bg-[#1A1610] border border-gold/20 z-20 shadow-xl">
                <button
                  onClick={() => { duplicate(invitation.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-cream/60 hover:text-cream hover:bg-gold/5"
                >
                  <Copy size={12} /> Duplicate
                </button>
                <button
                  onClick={() => { openModal("share", { invitation }); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-cream/60 hover:text-cream hover:bg-gold/5"
                >
                  <Share2 size={12} /> Share
                </button>
                <div className="h-px bg-gold/10 my-1" />
                <button
                  onClick={() => { openModal("delete_invitation", { id: invitation.id }); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/5"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Updated at */}
        <p className="text-[10px] text-cream/20 mt-3">
          Updated {formatRelativeTime(invitation.updatedAt)}
        </p>
      </div>
    </motion.div>
  );
}


// components/dashboard/StatCard.tsx

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delta?: string;
}

export function StatCard({ label, value, icon: Icon, delta }: StatCardProps) {
  return (
    <div className="bg-[#0D0B08] border border-gold/10 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-cream/35">
          {label}
        </span>
        <Icon size={14} className="text-gold/40" />
      </div>
      <div className="font-cormorant text-3xl font-light text-cream">
        {value}
      </div>
      {delta && (
        <p className="text-[10px] text-emerald-400/70 mt-1">{delta}</p>
      )}
    </div>
  );
}


// components/dashboard/RSVPTable.tsx
// Guest list table for a specific invitation

"use client";

import { useState } from "react";
import { useRSVPList, useRSVPStats } from "@/hooks/useRSVP";
import { formatDate } from "@/lib/utils/format";
import type { RSVP } from "@/types";

interface RSVPTableProps {
  invitationId: string;
}

const STATUS_PILL = {
  attending: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  declined: "bg-red-500/10 text-red-400 border-red-500/20",
  maybe: "bg-gold/10 text-gold border-gold/20",
};

export function RSVPTable({ invitationId }: RSVPTableProps) {
  const { data: rsvps = [], isLoading } = useRSVPList(invitationId);
  const { data: stats } = useRSVPStats(invitationId);
  const [filter, setFilter] = useState<"all" | "attending" | "declined" | "maybe">("all");
  const [search, setSearch] = useState("");

  const filtered = rsvps.filter((r) => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch =
      !search ||
      r.guestName.toLowerCase().includes(search.toLowerCase()) ||
      r.guestEmail?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Responses", value: stats.total },
            { label: "Attending", value: stats.attending },
            { label: "Declined", value: stats.declined },
            { label: "Total Guests", value: stats.totalGuests },
          ].map((s) => (
            <div key={s.label} className="bg-[#0D0B08] border border-gold/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-cream/35 mb-1">
                {s.label}
              </p>
              <p className="font-cormorant text-2xl font-light text-cream">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search guests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#0D0B08] border border-gold/15 text-cream text-sm px-3 py-2 outline-none placeholder:text-cream/20 flex-1 min-w-[180px]"
        />
        {(["all", "attending", "declined", "maybe"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.12em] border transition-all ${
              filter === f
                ? "border-gold text-gold"
                : "border-cream/10 text-cream/35 hover:border-cream/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-cream/30 text-center py-12">No responses yet</p>
      ) : (
        <div className="border border-gold/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/10">
                {["Guest", "Email", "Status", "Guests", "Meal", "Responded"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-cream/30 font-normal"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((rsvp, i) => (
                <RSVPRow key={rsvp.id} rsvp={rsvp} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RSVPRow({ rsvp, index }: { rsvp: RSVP; index: number }) {
  return (
    <tr
      className={`border-b border-gold/5 hover:bg-gold/[0.03] transition-colors ${
        index % 2 === 0 ? "bg-transparent" : "bg-cream/[0.01]"
      }`}
    >
      <td className="px-4 py-3 text-cream/80 font-medium">{rsvp.guestName}</td>
      <td className="px-4 py-3 text-cream/40">{rsvp.guestEmail ?? "—"}</td>
      <td className="px-4 py-3">
        <span
          className={`text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 border ${
            STATUS_PILL[rsvp.status]
          }`}
        >
          {rsvp.status}
        </span>
      </td>
      <td className="px-4 py-3 text-cream/50">{rsvp.guestCount}</td>
      <td className="px-4 py-3 text-cream/40 capitalize">
        {rsvp.mealPreference ?? "—"}
      </td>
      <td className="px-4 py-3 text-cream/30 text-xs">
        {formatDate(rsvp.respondedAt, "en-GB", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
    </tr>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-12 bg-cream/5 animate-pulse" />
      ))}
    </div>
  );
}


// components/dashboard/AnalyticsChart.tsx
// Simple bar chart for RSVP trends (no external chart lib required)

"use client";

interface AnalyticsChartProps {
  data: Array<{ label: string; attending: number; declined: number }>;
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  if (!data.length) return null;
  const maxVal = Math.max(...data.flatMap((d) => [d.attending, d.declined]), 1);

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-cream/35 mb-4">
        RSVP Trend
      </p>
      <div className="flex items-end gap-3 h-32">
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-0.5 h-24">
              <div
                className="flex-1 bg-emerald-500/30 hover:bg-emerald-500/50 transition-colors"
                style={{ height: `${(d.attending / maxVal) * 100}%` }}
                title={`Attending: ${d.attending}`}
              />
              <div
                className="flex-1 bg-red-500/25 hover:bg-red-500/40 transition-colors"
                style={{ height: `${(d.declined / maxVal) * 100}%` }}
                title={`Declined: ${d.declined}`}
              />
            </div>
            <span className="text-[9px] text-cream/25">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 bg-emerald-500/40" />
          <span className="text-[10px] text-cream/30">Attending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 bg-red-500/30" />
          <span className="text-[10px] text-cream/30">Declined</span>
        </div>
      </div>
    </div>
  );
}

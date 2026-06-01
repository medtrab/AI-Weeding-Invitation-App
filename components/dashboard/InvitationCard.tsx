"use client";
import { useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { MoreHorizontal, Edit2, Copy, Trash2, Share2, ExternalLink } from "lucide-react";
import { useDeleteInvitation, useDuplicateInvitation } from "@/hooks/useInvitations";
import { useUIStore } from "@/stores/useUIStore";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Invitation } from "@/types";

const STATUS_STYLES = {
  draft:     "border-cream/20 text-cream/40",
  published: "border-emerald-500/40 text-emerald-400",
  archived:  "border-cream/10 text-cream/20",
};
const EVENT_ICONS: Record<string, string> = {
  wedding:"💍", engagement:"💌", birthday:"🎂", corporate:"🏛️",
  baby_shower:"🍼", graduation:"🎓", vip:"⭐",
};

export function InvitationCard({ invitation }: { invitation: Invitation }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { mutate: del } = useDeleteInvitation();
  const { mutate: dup } = useDuplicateInvitation();
  const { openModal } = useUIStore();

  return (
    <motion.div className="group relative bg-[#0D0B08] border border-gold/10 hover:border-gold/25 transition-all" whileHover={{ y: -2 }}>
      <div className="h-1" style={{ background: invitation.colorPalette?.primary ?? "#C9A84C" }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">{EVENT_ICONS[invitation.eventType] ?? "✦"}</span>
            <div>
              <h3 className="text-sm font-medium text-cream/85">{invitation.title}</h3>
              {invitation.coupleName && <p className="text-[11px] text-cream/35 mt-0.5">{invitation.coupleName}</p>}
            </div>
          </div>
          <span className={`text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 border ${STATUS_STYLES[invitation.status]}`}>
            {invitation.status}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-cream/30 mb-4">
          <span>{new Date(invitation.eventDate).toLocaleDateString()}</span>
          <span>·</span>
          <span className="truncate">{invitation.venue}</span>
        </div>

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
          <Link href={`/dashboard/guests/${invitation.id}`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] uppercase tracking-[0.15em] border border-gold/20 text-cream/50 hover:border-gold/50 hover:text-gold transition-all">
              <Users size={11} /> Guests
            </button>
          </Link>

          {/* More menu */}
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-cream/30 hover:text-cream/70 border border-gold/10 hover:border-gold/30 transition-all">
              <MoreHorizontal size={14} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-1 w-44 bg-[#1A1610] border border-gold/20 z-20 shadow-xl">
                <button onClick={() => { dup(invitation.id); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-cream/60 hover:text-cream hover:bg-gold/5">
                  <Copy size={12} /> Duplicate
                </button>
                <button onClick={() => { openModal("share", { invitation }); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-cream/60 hover:text-cream hover:bg-gold/5">
                  <Share2 size={12} /> Share
                </button>
                <div className="h-px bg-gold/10 my-1" />
                <button onClick={() => { openModal("delete_invitation", { id: invitation.id }); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/5">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-[10px] text-cream/20 mt-3">Updated {formatRelativeTime(invitation.updatedAt)}</p>
      </div>
    </motion.div>
  );
}

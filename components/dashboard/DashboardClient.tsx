"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BarChart2, Send, Users, TrendingUp } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { InvitationCard } from "./InvitationCard";
import { StatCard } from "./StatCard";
import { NewInvitationModal } from "./NewInvitationModal";
import type { Invitation } from "@/types";

interface Props {
  invitations: Invitation[];
  stats: { total: number; published: number; rsvpCount: number; conversion: number };
  userName: string;
}

export function DashboardClient({ invitations, stats, userName }: Props) {
  const [showModal, setShowModal] = useState(false);
  const recent = invitations.slice(0, 4);

  return (
    <DashboardLayout onNewInvitation={() => setShowModal(true)}>
      <div className="p-4 sm:p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="font-cormorant text-3xl font-light text-cream mb-1">
            Your Dashboard
          </h1>
          <p className="text-sm text-cream/40 tracking-wide">
            Welcome back{userName ? `, ${userName}` : ""}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-8 sm:mb-12">
          <StatCard label="Total Invitations" value={stats.total}      icon={BarChart2}   />
          <StatCard label="Published"          value={stats.published}  icon={Send}        />
          <StatCard label="Total RSVPs"        value={stats.rsvpCount}  icon={Users}       />
          <StatCard label="Conversion"         value={`${stats.conversion}%`} icon={TrendingUp} />
        </div>

        {/* Recent invitations */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-cormorant text-xl font-light text-cream">
            Recent Invitations
          </h2>
          <Link
            href="/dashboard/invitations"
            className="text-xs uppercase tracking-[0.15em] text-gold/60 hover:text-gold transition-colors"
          >
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="border border-dashed border-gold/15 p-16 text-center max-w-lg">
            <p className="font-cormorant text-2xl font-light text-cream/50 mb-2">
              No invitations yet
            </p>
            <p className="text-sm text-cream/30 mb-6">
              Create your first AI-powered invitation
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 bg-gold text-deep text-xs uppercase tracking-[0.2em] hover:bg-gold-light transition-colors"
            >
              Create Invitation
            </button>
          </div>
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

      <NewInvitationModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </DashboardLayout>
  );
}

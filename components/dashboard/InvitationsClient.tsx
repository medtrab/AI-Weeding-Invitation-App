"use client";
import { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { InvitationCard } from "./InvitationCard";
import { NewInvitationModal } from "./NewInvitationModal";
import type { Invitation } from "@/types";

export function InvitationsClient({ invitations }: { invitations: Invitation[] }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <DashboardLayout onNewInvitation={() => setShowModal(true)}>
      <div className="p-4 sm:p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-cormorant text-3xl font-light text-cream mb-1">
              All Invitations
            </h1>
            <p className="text-sm text-cream/40">
              {invitations.length} invitation{invitations.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gold text-deep text-[11px] uppercase tracking-[0.2em] hover:bg-gold-light transition-colors"
          >
            + New Invitation
          </button>
        </div>

        {invitations.length === 0 ? (
          <div className="border border-dashed border-gold/15 p-16 text-center">
            <p className="font-cormorant text-2xl font-light text-cream/50 mb-6">
              No invitations yet
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 bg-gold text-deep text-xs uppercase tracking-[0.2em] hover:bg-gold-light transition-colors"
            >
              Create Your First Invitation
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {invitations.map((inv) => (
              <InvitationCard key={inv.id} invitation={inv} />
            ))}
          </div>
        )}
      </div>

      <NewInvitationModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </DashboardLayout>
  );
}

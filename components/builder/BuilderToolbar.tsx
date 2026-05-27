"use client";
import { ArrowLeft, Undo2, Redo2, Smartphone, Monitor, Eye } from "lucide-react";
import Link from "next/link";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { usePublishInvitation } from "@/hooks/useInvitations";

export function BuilderToolbar() {
  const { invitation, isDirty, isSaving, previewMode, setPreviewMode, undo, redo, history } = useInvitationStore();
  const { mutate: publish, isPending } = usePublishInvitation(invitation?.id ?? "");

  return (
    <div className="h-14 flex items-center px-4 border-b border-gold/10 bg-[#0D0B08] z-20 gap-3">
      <Link href="/dashboard" className="text-cream/40 hover:text-cream/80 transition-colors p-1">
        <ArrowLeft size={16} />
      </Link>
      <div className="h-5 w-px bg-gold/10" />
      <span className="text-sm text-cream/60 font-light tracking-wide flex-1 truncate">
        {invitation?.title ?? "Invitation Builder"}
      </span>
      {isSaving  && <span className="text-[10px] uppercase tracking-[0.15em] text-gold/60 animate-pulse">Saving…</span>}
      {isDirty && !isSaving && <span className="text-[10px] uppercase tracking-[0.15em] text-cream/25">Unsaved</span>}

      {/* Preview toggle */}
      <div className="flex border border-gold/15 rounded-sm overflow-hidden">
        {[
          { mode: "mobile" as const, Icon: Smartphone },
          { mode: "desktop" as const, Icon: Monitor },
        ].map(({ mode, Icon }) => (
          <button key={mode} onClick={() => setPreviewMode(mode)}
            className={`px-3 py-2 transition-colors ${previewMode === mode ? "bg-gold/10 text-gold" : "text-cream/30 hover:text-cream/60"}`}>
            <Icon size={14} />
          </button>
        ))}
      </div>

      <button onClick={undo} disabled={history.past.length === 0} className="p-2 text-cream/30 hover:text-cream/70 disabled:opacity-20 transition-colors">
        <Undo2 size={14} />
      </button>
      <button onClick={redo} disabled={history.future.length === 0} className="p-2 text-cream/30 hover:text-cream/70 disabled:opacity-20 transition-colors">
        <Redo2 size={14} />
      </button>

      {invitation?.status === "published" && (
        <Link href={`/i/${invitation.slug}`} target="_blank"
          className="flex items-center gap-1.5 px-4 py-2 border border-gold/20 text-[11px] uppercase tracking-[0.15em] text-cream/50 hover:border-gold/50 hover:text-gold transition-all">
          <Eye size={12} /> Preview
        </Link>
      )}

      <button
        onClick={() => publish()}
        disabled={isPending}
        className="px-6 py-2 bg-gold text-deep text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        {isPending ? "Publishing…" : invitation?.status === "published" ? "Published ✦" : "Publish"}
      </button>
    </div>
  );
}

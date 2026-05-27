"use client";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { MUSIC_LIBRARY } from "@/config/defaults";
import { Play, X } from "lucide-react";

export function MusicPicker() {
  const { invitation, updateField } = useInvitationStore();
  if (!invitation) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Background Music</span>
        {invitation.musicUrl && (
          <button onClick={() => { updateField("musicUrl",""); updateField("musicLabel",""); }}
            className="text-[10px] text-red-400/60 hover:text-red-400 flex items-center gap-1">
            <X size={10} /> Remove
          </button>
        )}
      </div>
      <div className="space-y-1">
        {MUSIC_LIBRARY.map((track) => (
          <button key={track.url} onClick={() => { updateField("musicUrl", track.url); updateField("musicLabel", track.label); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all border ${
              invitation.musicUrl === track.url
                ? "border-gold/50 bg-gold/10 text-cream"
                : "border-transparent hover:bg-cream/5 text-cream/50"
            }`}>
            <Play size={11} className="shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate">{track.label}</p>
              <p className="text-[10px] text-cream/25">{track.genre}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { Play, X, Music, Link } from "lucide-react";

const PRESETS = [
  { label: "✦ Ambient Oud & Piano",     genre: "Arabic · Generated",     url: "" },
  { label: "Romantic Strings",           genre: "Classical · Mixkit",     url: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3" },
  { label: "Mediterranean Piano",        genre: "Piano · Mixkit",         url: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3" },
  { label: "Oriental Breeze",            genre: "Oriental · Mixkit",      url: "https://assets.mixkit.co/music/preview/mixkit-sunset-in-the-desert-700.mp3" },
  { label: "Soft Wedding Waltz",         genre: "Orchestral · Mixkit",    url: "https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3" },
];

export function MusicPicker() {
  const { invitation, updateField } = useInvitationStore();
  const [customUrl, setCustomUrl]   = useState("");
  const [showCustom, setShowCustom] = useState(false);
  if (!invitation) return null;

  const setTrack = (url: string, label: string) => {
    updateField("musicUrl",   url   as never);
    updateField("musicLabel", label as never);
  };

  const applyCustomUrl = () => {
    if (!customUrl.trim()) return;
    setTrack(customUrl.trim(), "Custom Music");
    setCustomUrl("");
    setShowCustom(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40 flex items-center gap-1.5">
          <Music size={10} /> Background Music
        </span>
        {invitation.musicUrl && (
          <button onClick={() => setTrack("", "")}
            className="text-[10px] text-red-400/60 hover:text-red-400 flex items-center gap-1">
            <X size={10} /> Remove
          </button>
        )}
      </div>

      {/* Currently playing */}
      {invitation.musicLabel && (
        <div className="mb-3 px-3 py-2 bg-gold/10 border border-gold/30 text-[11px] text-gold flex items-center gap-2">
          <span className="animate-pulse">♪</span>
          <span className="truncate">{invitation.musicLabel}</span>
        </div>
      )}

      {/* Presets */}
      <div className="space-y-1 mb-3">
        {PRESETS.map((track) => (
          <button key={track.label} onClick={() => setTrack(track.url, track.label)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all border ${
              invitation.musicUrl === track.url && invitation.musicLabel === track.label
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

      {/* Custom URL */}
      <button onClick={() => setShowCustom(!showCustom)}
        className="w-full flex items-center gap-2 px-3 py-2 border border-dashed border-gold/20 text-[11px] text-cream/35 hover:text-cream/60 hover:border-gold/40 transition-all">
        <Link size={11} /> Paste your own music URL
      </button>

      {showCustom && (
        <div className="mt-2 space-y-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://... (mp3, wav, ogg)"
            className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-xs px-3 py-2.5 outline-none placeholder:text-cream/20 focus:border-gold/40"
          />
          <p className="text-[10px] text-cream/25 leading-relaxed">
            Direct link to an MP3 file. Works with Dropbox, Google Drive (direct link), or any public MP3 URL.
          </p>
          <button onClick={applyCustomUrl}
            disabled={!customUrl.trim()}
            className="w-full py-2 bg-gold/15 border border-gold/30 text-gold text-[11px] uppercase tracking-[0.15em] hover:bg-gold/20 transition-all disabled:opacity-40">
            Apply
          </button>
        </div>
      )}

      <p className="mt-3 text-[10px] text-cream/20 leading-relaxed">
        ✦ Music plays automatically on first tap. The ambient oud option works without any URL — generated live in the browser.
      </p>
    </div>
  );
}

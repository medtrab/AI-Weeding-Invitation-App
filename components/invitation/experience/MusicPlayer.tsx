"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, VolumeX, Volume2, Play, Pause } from "lucide-react";
import type { Invitation } from "@/types";

// Curated free music URLs by genre/style
const MUSIC_LIBRARY: Record<string, { url: string; label: string }> = {
  arabic_oriental:  { url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", label: "Oriental Oud · Ambient" },
  romantic_piano:   { url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", label: "Romantic Piano" },
  classical:        { url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", label: "Classical Strings" },
  jazz_lounge:      { url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", label: "Jazz Lounge" },
};

interface Props {
  invitation: Invitation;
  isPreview?: boolean;
}

export function MusicPlayer({ invitation, isPreview }: Props) {
  const p = invitation.colorPalette;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [hasInteracted, setHasInteracted] = useState(false);

  const musicUrl = invitation.musicUrl ?? MUSIC_LIBRARY.romantic_piano.url;
  const musicLabel = invitation.musicLabel ?? "Background Music";

  useEffect(() => {
    if (isPreview) return;
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    // Fade in on first interaction
    const handleFirstClick = () => {
      if (hasInteracted) return;
      setHasInteracted(true);
      audio.play().then(() => {
        setIsPlaying(true);
        setShowLabel(true);
        setTimeout(() => setShowLabel(false), 3000);
        // Fade in
        let v = 0;
        const fade = setInterval(() => {
          v = Math.min(v + 0.04, volume);
          audio.volume = v;
          if (v >= volume) clearInterval(fade);
        }, 100);
      }).catch(() => {});
    };

    document.addEventListener("click", handleFirstClick, { once: true });
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [musicUrl, isPreview]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (isPreview) return null;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3 }}
    >
      {/* Music label toast */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            className="px-3 py-2 text-[11px] uppercase tracking-[0.15em]"
            style={{
              background: `${p.secondary}ee`,
              color: p.primary,
              border: `1px solid ${p.primary}30`,
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            ♪ {musicLabel}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Equalizer animation when playing */}
      {isPlaying && !isMuted && (
        <div className="flex items-end gap-0.5 h-5">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{ background: p.primary }}
              animate={{ height: [4, 12 + i * 3, 4, 16, 4] }}
              transition={{ duration: 0.8 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

      {/* Play/pause button */}
      <motion.button
        onClick={toggle}
        className="w-10 h-10 flex items-center justify-center"
        style={{
          background: `${p.secondary}cc`,
          border: `1px solid ${p.primary}40`,
          color: p.primary,
          backdropFilter: "blur(8px)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
      </motion.button>

      {/* Mute button */}
      <motion.button
        onClick={toggleMute}
        className="w-10 h-10 flex items-center justify-center"
        style={{
          background: `${p.secondary}cc`,
          border: `1px solid ${p.primary}40`,
          color: isMuted ? `${p.primary}40` : p.primary,
          backdropFilter: "blur(8px)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </motion.button>
    </motion.div>
  );
}

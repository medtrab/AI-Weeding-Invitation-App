"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VolumeX, Volume2, Pause, Play } from "lucide-react";
import type { Invitation } from "@/types";

// ── Ambient Music Engine ───────────────────────────────────────────────────
// Pure Web Audio API — no files, no CORS, no broken URLs. Always works.

function buildAndStartEngine(): AudioContext {
  const AudioCtx = window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();

  const master = ctx.createGain();
  master.connect(ctx.destination);
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 4); // fade in over 4s

  // Arabic pentatonic: A2 B2 D3 E3 G3 A3 B3 D4 E4 G4
  const scale = [110, 123.5, 146.8, 164.8, 196, 220, 246.9, 293.7, 329.6, 392];

  function tone(
    freq: number, start: number, dur: number,
    type: OscillatorType = "sine", vol = 0.12
  ) {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    const lpf  = ctx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.value = 1200;

    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 6;

    osc.connect(lpf); lpf.connect(gain); gain.connect(master);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.06);
    gain.gain.exponentialRampToValueAtTime(vol * 0.25, start + dur * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  function pad(freq: number, start: number, dur: number, vol = 0.05) {
    [-5, 0, 5].forEach(d => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const lpf  = ctx.createBiquadFilter();
      lpf.type = "lowpass"; lpf.frequency.value = 600;

      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = d;
      osc.connect(lpf); lpf.connect(gain); gain.connect(master);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(vol, start + 1.2);
      gain.gain.setValueAtTime(vol, start + dur - 1.2);
      gain.gain.linearRampToValueAtTime(0, start + dur);
      osc.start(start);
      osc.stop(start + dur + 0.1);
    });
  }

  // Melody pattern — indices into scale array
  const melody  = [7, 9, 7, 5, 3, 5, 7, 5, 3, 2, 0, 2, 3, 5, 7, 9];
  const rhythm  = [0.6,0.4,0.6,0.8,0.6,0.4,0.8,0.6,0.6,0.4,0.8,0.6,0.6,0.4,0.8,1.2];
  const total   = rhythm.reduce((a, b) => a + b, 0); // ~9.8s per phrase

  function schedulePhraseAt(phraseStart: number) {
    let t = phraseStart;
    melody.forEach((si, i) => {
      const f = scale[si];
      tone(f,       t, rhythm[i] * 0.9, "triangle", 0.1);   // melody
      tone(f * 2,   t, rhythm[i] * 0.5, "sine",     0.04);  // octave shimmer
      if (i % 4 === 0) pad(f * 0.5, t, rhythm[i] * 3, 0.04); // bass pad
      t += rhythm[i];
    });
    // Drone / bass under whole phrase
    pad(scale[0], phraseStart, total * 0.9, 0.06);
    pad(scale[2], phraseStart + total * 0.3, total * 0.6, 0.03);
  }

  // Schedule phrases to overlap slightly for seamless looping
  const overlap = 1.5; // seconds of overlap
  let phraseStart = ctx.currentTime + 0.1;

  function loop() {
    schedulePhraseAt(phraseStart);
    phraseStart += total;
    // Re-schedule just before phrase ends
    const msUntilNext = (phraseStart - overlap - ctx.currentTime) * 1000;
    setTimeout(loop, Math.max(msUntilNext, 100));
  }

  loop();
  return ctx;
}

// ── Component ──────────────────────────────────────────────────────────────
interface Props { invitation: Invitation; isPreview?: boolean; }

export function MusicPlayer({ invitation, isPreview }: Props) {
  const p = invitation.colorPalette as {
    primary: string; secondary: string; background: string;
  };

  const ctxRef      = useRef<AudioContext | null>(null);
  const [playing,   setPlaying]   = useState(false);
  const [muted,     setMuted]     = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const startedRef  = useRef(false);

  // Start music on first user interaction (required by browsers)
  useEffect(() => {
    if (isPreview) return;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      try {
        ctxRef.current = buildAndStartEngine();
        setPlaying(true);
        setShowLabel(true);
        setTimeout(() => setShowLabel(false), 3500);
      } catch (e) {
        console.warn("Web Audio failed:", e);
      }
    };

    // Listen for any interaction
    window.addEventListener("click",      start, { once: true });
    window.addEventListener("touchstart", start, { once: true, passive: true });
    window.addEventListener("keydown",    start, { once: true });

    return () => {
      window.removeEventListener("click",      start);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("keydown",    start);
    };
  }, [isPreview]);

  const toggle = () => {
    const ctx = ctxRef.current;

    // If not started yet, start now (direct button tap = user gesture)
    if (!startedRef.current) {
      startedRef.current = true;
      try {
        ctxRef.current = buildAndStartEngine();
        setPlaying(true);
        setShowLabel(true);
        setTimeout(() => setShowLabel(false), 3500);
      } catch (e) {
        console.warn("Web Audio failed:", e);
      }
      return;
    }

    if (!ctx) return;

    if (playing) {
      ctx.suspend().then(() => setPlaying(false));
    } else {
      ctx.resume().then(() => setPlaying(true));
    }
  };

  const toggleMute = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    // Find the master gain node — suspend/resume approach is cleaner
    // Since we can't easily access master gain from outside, use suspend
    if (!muted) {
      // "Mute" — set gain to 0 via a suspended context trick
      // Simplest: just suspend but keep playing state visually
      ctx.suspend();
      setMuted(true);
    } else {
      ctx.resume();
      setMuted(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => { ctxRef.current?.close(); };
  }, []);

  if (isPreview) return null;

  const label = invitation.musicLabel || "Ambient Oud · Mediterranean";
  const primary = (p as { primary?: string }).primary || "#C9A84C";
  const secondary = (p as { secondary?: string }).secondary || "#1a1608";

  return (
    <motion.div
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}>

      {/* Now playing toast */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            className="px-3 py-2 text-[11px] tracking-wide flex items-center gap-2 rounded-sm max-w-[160px]"
            style={{
              background: `${secondary}ee`,
              color: primary,
              border: `1px solid ${primary}30`,
            }}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}>
            <span className="animate-pulse shrink-0">♪</span>
            <span className="truncate">{label}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Equalizer bars */}
      {playing && !muted && (
        <div className="flex items-end gap-0.5 h-4">
          {[3, 5, 4, 6, 3].map((h, i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{ background: primary }}
              animate={{ height: [2, h * 2, 2, h * 2.5, 2] }}
              transition={{
                duration: 0.6 + i * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Play / Pause */}
      <motion.button
        onClick={toggle}
        className="w-10 h-10 flex items-center justify-center rounded-sm backdrop-blur-sm"
        style={{
          background: `${secondary}cc`,
          border: `1px solid ${primary}40`,
          color: primary,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={playing ? "Pause music" : "Play music"}>
        {playing && !muted ? <Pause size={14} /> : <Play size={14} />}
      </motion.button>

      {/* Mute */}
      <motion.button
        onClick={toggleMute}
        className="w-10 h-10 flex items-center justify-center rounded-sm backdrop-blur-sm"
        style={{
          background: `${secondary}cc`,
          border: `1px solid ${primary}40`,
          color: muted ? `${primary}35` : primary,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={muted ? "Unmute" : "Mute"}>
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </motion.button>
    </motion.div>
  );
}

"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VolumeX, Volume2, Pause, Play } from "lucide-react";
import type { Invitation } from "@/types";

// ── Ambient Music Engine ────────────────────────────────────────────────────
// Pure Web Audio API synthesis — Arabic/Mediterranean ambient music
// No files, no CORS, no broken URLs. Works on all modern browsers.

function startAmbientMusic(ctx: AudioContext): void {
  // Ensure context is running
  if (ctx.state === "suspended") ctx.resume();

  const master = ctx.createGain();
  master.connect(ctx.destination);

  // Fade in over 3 seconds
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 3);

  // Arabic pentatonic scale (A minor with flat 2nd — very Mediterranean)
  const scale = [
    110, 116.5, 138.6, 164.8, 185,    // A2 Bb2 Db3 E3 F#3
    220, 233,   277.2, 329.6, 370,    // A3 Bb3 Db4 E4 F#4
    440, 466,   554.4, 659.3,         // A4 Bb4 Db5 E5
  ];

  // Creates a warm triangle-wave note (oud-like)
  function note(freq: number, t: number, dur: number, vol = 0.1) {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    const lpf  = ctx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.value = 1400;
    lpf.Q.value = 0.7;

    osc.type = "triangle";
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 8;
    osc.connect(lpf);
    lpf.connect(gain);
    gain.connect(master);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(vol * 0.2, t + dur * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  // Creates a soft sine pad (string-like)
  function pad(freq: number, t: number, dur: number, vol = 0.04) {
    for (const detune of [-4, 0, 4]) {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const lpf  = ctx.createBiquadFilter();
      lpf.type = "lowpass";
      lpf.frequency.value = 700;

      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = detune;
      osc.connect(lpf);
      lpf.connect(gain);
      gain.connect(master);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 1.0);
      gain.gain.setValueAtTime(vol, t + dur - 1.0);
      gain.gain.linearRampToValueAtTime(0, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.1);
    }
  }

  // Melody: indices into scale, with timing in seconds
  const melody  = [9, 11, 9, 7, 5, 7, 9, 7, 5, 4, 2, 4, 5, 7, 9, 11];
  const rhythm  = [0.6, 0.4, 0.6, 0.8, 0.6, 0.4, 0.8, 0.6, 0.6, 0.4, 0.8, 0.6, 0.6, 0.4, 0.8, 1.2];
  const phaseLen = rhythm.reduce((a, b) => a + b, 0); // ≈ 9.2s

  function schedulePhrase(start: number) {
    let t = start;
    melody.forEach((si, i) => {
      const f = scale[si % scale.length];
      note(f, t, rhythm[i] * 0.85, 0.09);                        // main melody
      note(f * 2, t + 0.02, rhythm[i] * 0.4, 0.025);             // octave shimmer
      if (i % 3 === 0) pad(f * 0.5, t, rhythm[i] * 2.5, 0.035);  // bass pads
      t += rhythm[i];
    });
    // Harmonic pads under whole phrase
    pad(scale[0],  start,              phaseLen * 0.95, 0.055);
    pad(scale[2],  start + phaseLen * 0.25, phaseLen * 0.7,  0.03);
    pad(scale[4],  start + phaseLen * 0.5,  phaseLen * 0.45, 0.025);
  }

  // Schedule phrases with 1.5s overlap so looping is seamless
  let phraseStart = ctx.currentTime + 0.05;
  let loopActive  = true;

  function loop() {
    if (!loopActive) return;
    schedulePhrase(phraseStart);
    phraseStart += phaseLen;
    const msUntilNext = (phraseStart - 1.5 - ctx.currentTime) * 1000;
    setTimeout(loop, Math.max(msUntilNext, 50));
  }

  loop();

  // Store stopper on the context object so MusicPlayer can clean up
  (ctx as AudioContext & { _stopAmbient?: () => void })._stopAmbient = () => {
    loopActive = false;
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
  };
}

// ── Component ────────────────────────────────────────────────────────────────
interface Props {
  invitation:   Invitation;
  isPreview?:   boolean;
  unlockedCtx?: AudioContext | null; // pre-unlocked by envelope tap
}

export function MusicPlayer({ invitation, isPreview, unlockedCtx }: Props) {
  const p         = invitation.colorPalette as { primary: string; secondary: string };
  const primary   = p.primary   || "#C9A84C";
  const secondary = p.secondary || "#1a1608";

  const ctxRef      = useRef<AudioContext | null>(null);
  const startedRef  = useRef(false);
  const [playing,   setPlaying]   = useState(false);
  const [muted,     setMuted]     = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  // ── Start music as soon as component mounts with an unlocked context ──
  useEffect(() => {
    if (isPreview || startedRef.current) return;

    const launch = (ctx: AudioContext) => {
      startedRef.current = true;
      ctxRef.current     = ctx;
      startAmbientMusic(ctx);
      setPlaying(true);
      setShowLabel(true);
      setTimeout(() => setShowLabel(false), 4000);
    };

    // Case 1: envelope already tapped → context unlocked → start immediately
    if (unlockedCtx) {
      launch(unlockedCtx);
      return;
    }

    // Case 2: no envelope (isPreview=false but no envelope used) → wait for tap
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    const onInteraction = () => {
      if (startedRef.current) return;
      try {
        const ctx = new AudioCtx();
        launch(ctx);
      } catch { /* ignore */ }
    };

    window.addEventListener("click",      onInteraction, { once: true });
    window.addEventListener("touchstart", onInteraction, { once: true, passive: true });
    return () => {
      window.removeEventListener("click",      onInteraction);
      window.removeEventListener("touchstart", onInteraction);
    };
  }, [isPreview, unlockedCtx]);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      const ctx = ctxRef.current as (AudioContext & { _stopAmbient?: () => void }) | null;
      ctx?._stopAmbient?.();
    };
  }, []);

  const toggle = () => {
    // If not started yet, try to start now (direct button tap = user gesture)
    if (!startedRef.current) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        startedRef.current = true;
        ctxRef.current     = ctx;
        startAmbientMusic(ctx);
        setPlaying(true);
        setShowLabel(true);
        setTimeout(() => setShowLabel(false), 4000);
      } catch { /* ignore */ }
      return;
    }

    const ctx = ctxRef.current;
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
    if (!muted) { ctx.suspend(); setMuted(true); }
    else        { ctx.resume();  setMuted(false); }
  };

  if (isPreview) return null;

  const label = invitation.musicLabel || "Ambient Oud · Mediterranean";

  return (
    <motion.div
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}>

      {/* Now playing toast */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            className="px-3 py-2 text-[11px] tracking-wide flex items-center gap-2 rounded-sm max-w-[180px]"
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

      {/* Live equalizer bars */}
      {playing && !muted && (
        <div className="flex items-end gap-0.5 h-4">
          {[3, 5, 4, 7, 3, 5].map((h, i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{ background: primary }}
              animate={{ height: [2, h * 2, 2, h * 3, 2] }}
              transition={{ duration: 0.5 + i * 0.12, repeat: Infinity, ease: "easeInOut" }}
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
        whileTap={{ scale: 0.95 }}>
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
        whileTap={{ scale: 0.95 }}>
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </motion.button>
    </motion.div>
  );
}

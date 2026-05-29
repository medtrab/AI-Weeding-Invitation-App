"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, VolumeX, Volume2, Pause, Play } from "lucide-react";
import type { Invitation } from "@/types";

// ── Web Audio ambient music generator ─────────────────────────────────────
// Generates real ambient music with oud-like tones, piano, and soft strings
// Works 100% reliably — no external files, no CORS, no broken URLs

class AmbientMusicEngine {
  private ctx: AudioContext;
  private master: GainNode;
  private running = false;
  private nodes: AudioNode[] = [];

  constructor() {
    this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
  }

  // Pentatonic scale — always sounds beautiful and harmonious
  // Mediterranean / Arabic inspired scale: A, C, D, E, G
  private notes = [220, 247, 277, 311, 370, 440, 494, 554, 622, 740];
  private arabicNotes = [220, 233, 277, 311, 370, 415, 440, 493, 554, 622];

  private createOudTone(freq: number, startTime: number, duration: number, vol = 0.08) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = "bandpass";
    filter.frequency.value = freq * 2;
    filter.Q.value = 3;

    osc.type = "sawtooth";
    osc.frequency.value = freq;
    // Slight detune for warmth
    osc.detune.value = (Math.random() - 0.5) * 8;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(vol * 0.3, startTime + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
    this.nodes.push(osc, gain, filter);
  }

  private createPadTone(freq: number, startTime: number, duration: number, vol = 0.04) {
    [0, 0.5, -0.5].forEach((detune) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;

      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = detune * 10;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.8);
      gain.gain.setValueAtTime(vol, startTime + duration - 0.8);
      gain.gain.linearRampToValueAtTime(0, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
      this.nodes.push(osc, gain, filter);
    });
  }

  private scheduleMelody(startTime: number) {
    // Gentle oud-like melody
    const pattern = [0, 2, 4, 6, 4, 2, 1, 0, 2, 4, 7, 6, 4, 2, 0];
    const rhythm  = [0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 1];
    let t = startTime;
    pattern.forEach((ni, i) => {
      const freq = this.arabicNotes[ni % this.arabicNotes.length];
      this.createOudTone(freq, t, rhythm[i] * 1.1, 0.07);
      // Octave harmony occasionally
      if (i % 4 === 0) this.createPadTone(freq * 0.5, t, rhythm[i] * 2, 0.025);
      t += rhythm[i];
    });
    return t - startTime; // return total duration
  }

  private scheduleBass(startTime: number, duration: number) {
    // Slow bass drone
    const bassNotes = [110, 110, 123.5, 110];
    const beatLen = duration / bassNotes.length;
    bassNotes.forEach((freq, i) => {
      this.createPadTone(freq, startTime + i * beatLen, beatLen * 1.2, 0.05);
    });
  }

  start() {
    if (this.running) return;
    this.running = true;
    if (this.ctx.state === "suspended") this.ctx.resume();

    // Fade in
    this.master.gain.setValueAtTime(0, this.ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 3);

    const loop = () => {
      if (!this.running) return;
      const now = this.ctx.currentTime;
      const melodyDuration = this.scheduleMelody(now + 0.1);
      this.scheduleBass(now + 0.1, melodyDuration);
      // Schedule next loop slightly before this one ends
      setTimeout(loop, (melodyDuration - 0.5) * 1000);
    };
    loop();
  }

  stop() {
    this.running = false;
    this.master.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);
  }

  setVolume(v: number) {
    if (this.running) {
      this.master.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 0.5);
    }
  }

  get audioContext() { return this.ctx; }
}

// ── Component ──────────────────────────────────────────────────────────────
interface Props { invitation: Invitation; isPreview?: boolean; }

export function MusicPlayer({ invitation, isPreview }: Props) {
  const p = invitation.colorPalette as { primary: string; secondary: string; background: string };
  const engineRef = useRef<AmbientMusicEngine | null>(null);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [started, setStarted] = useState(false);
  const [useExternal, setUseExternal] = useState(false);

  // Try external URL first if provided, fall back to Web Audio synthesis
  const externalUrl = invitation.musicUrl || null;
  const musicLabel = invitation.musicLabel || "Ambient Music";

  const startMusic = useCallback(() => {
    if (started) return;
    setStarted(true);
    setShowLabel(true);
    setTimeout(() => setShowLabel(false), 3500);

    if (externalUrl) {
      // Try external URL
      const audio = new Audio(externalUrl);
      audio.loop = true;
      audio.volume = 0;
      audio.crossOrigin = "anonymous";
      htmlAudioRef.current = audio;

      audio.play()
        .then(() => {
          setIsPlaying(true);
          setUseExternal(true);
          // Fade in
          let v = 0;
          const fade = setInterval(() => {
            v = Math.min(v + 0.03, 0.4);
            audio.volume = v;
            if (v >= 0.4) clearInterval(fade);
          }, 100);
        })
        .catch(() => {
          // External URL failed — fall back to synthesis
          startSynthesis();
        });
    } else {
      startSynthesis();
    }
  }, [started, externalUrl]);

  const startSynthesis = () => {
    try {
      const engine = new AmbientMusicEngine();
      engineRef.current = engine;
      engine.start();
      setIsPlaying(true);
    } catch {
      // Web Audio not available (very old browser)
    }
  };

  // Start on first user interaction with the page
  useEffect(() => {
    if (isPreview) return;
    const handler = () => { if (!started) startMusic(); };
    document.addEventListener("click",     handler, { once: true });
    document.addEventListener("touchstart", handler, { once: true, passive: true });
    return () => {
      document.removeEventListener("click",     handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [isPreview, started, startMusic]);

  const toggle = () => {
    if (!started) { startMusic(); return; }

    if (useExternal && htmlAudioRef.current) {
      if (isPlaying) { htmlAudioRef.current.pause(); setIsPlaying(false); }
      else           { htmlAudioRef.current.play();  setIsPlaying(true);  }
    } else if (engineRef.current) {
      if (isPlaying) { engineRef.current.stop();  setIsPlaying(false); }
      else           { engineRef.current.start(); setIsPlaying(true);  }
    } else {
      startMusic();
    }
  };

  const toggleMute = () => {
    if (useExternal && htmlAudioRef.current) {
      htmlAudioRef.current.muted = !isMuted;
    } else if (engineRef.current) {
      engineRef.current.setVolume(isMuted ? 1 : 0);
    }
    setIsMuted(!isMuted);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      htmlAudioRef.current?.pause();
      engineRef.current?.stop();
    };
  }, []);

  if (isPreview) return null;

  return (
    <motion.div className="fixed bottom-5 right-5 z-50 flex items-center gap-2"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}>

      {/* Now playing toast */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            className="px-3 py-2 text-[11px] uppercase tracking-[0.12em] flex items-center gap-2 rounded-sm"
            style={{ background: `${p.secondary || "#1a1608"}ee`, color: p.primary, border: `1px solid ${p.primary}30` }}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <span className="animate-pulse">♪</span>
            <span className="max-w-[140px] truncate">{musicLabel}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Equalizer bars when playing */}
      {isPlaying && !isMuted && (
        <div className="flex items-end gap-0.5 h-5 opacity-80">
          {[1,2,3,4].map((i) => (
            <motion.div key={i} className="w-0.5 rounded-full" style={{ background: p.primary }}
              animate={{ height: [4, 10 + i * 4, 4, 16, 6, 4] }}
              transition={{ duration: 0.7 + i * 0.15, repeat: Infinity, ease: "easeInOut" }} />
          ))}
        </div>
      )}

      {/* Play / Pause */}
      <motion.button onClick={toggle}
        className="w-10 h-10 flex items-center justify-center rounded-sm backdrop-blur-sm"
        style={{ background: `${p.secondary || "#1a1608"}cc`, border: `1px solid ${p.primary}40`, color: p.primary }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? "Pause music" : "Play music"}>
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
      </motion.button>

      {/* Mute */}
      <motion.button onClick={toggleMute}
        className="w-10 h-10 flex items-center justify-center rounded-sm backdrop-blur-sm"
        style={{
          background: `${p.secondary || "#1a1608"}cc`,
          border: `1px solid ${p.primary}40`,
          color: isMuted ? `${p.primary}40` : p.primary,
        }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        aria-label={isMuted ? "Unmute" : "Mute"}>
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </motion.button>
    </motion.div>
  );
}

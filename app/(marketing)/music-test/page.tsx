"use client";
import { useState, useRef } from "react";

// Inline test — same engine as MusicPlayer
export default function MusicTestPage() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [status, setStatus] = useState("Not started");

  const test = () => {
    try {
      const AudioCtx = window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) { setStatus("❌ Web Audio API not supported in this browser"); return; }

      const ctx = new AudioCtx();
      ctxRef.current = ctx;
      setStatus(`✅ AudioContext created — state: ${ctx.state}`);

      const master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);

      // Play a simple tone
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 440; // A4
      osc.connect(master);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);

      setTimeout(() => {
        // Play scale
        const notes = [261.6, 293.7, 329.6, 349.2, 392, 440, 493.9, 523.3];
        notes.forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.frequency.value = freq;
          o.type = "triangle";
          o.connect(g); g.connect(master);
          g.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.2);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.3);
          o.start(ctx.currentTime + i * 0.2);
          o.stop(ctx.currentTime + i * 0.2 + 0.35);
        });
        setStatus("✅ Playing scale — if you hear it, music will work in invitations!");
      }, 600);

    } catch (e) {
      setStatus(`❌ Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B08", color: "#FAF7F2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "system-ui" }}>
      <h1 style={{ color: "#C9A84C", fontSize: "1.5rem", marginBottom: "1rem" }}>🎵 Music Engine Test</h1>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", textAlign: "center" }}>
        Tap the button below. If you hear a musical scale, the ambient music engine works on your device.
      </p>
      <button onClick={test} style={{
        padding: "1rem 2rem", background: "#C9A84C", color: "#0D0B08",
        border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: "bold",
        borderRadius: "4px"
      }}>
        ▶ Test Music Engine
      </button>
      <p style={{ marginTop: "1.5rem", color: status.startsWith("✅") ? "#4CAF50" : status.startsWith("❌") ? "#f44336" : "#C9A84C" }}>
        {status}
      </p>
      <div style={{ marginTop: "2rem", color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", textAlign: "center", maxWidth: "400px" }}>
        <p>The music player generates ambient oud music directly in the browser using the Web Audio API — no external files needed.</p>
        <p style={{ marginTop: "0.5rem" }}>Music starts automatically on first tap of any invitation page.</p>
      </div>
    </div>
  );
}

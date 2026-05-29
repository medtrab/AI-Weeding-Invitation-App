"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Music, AlertCircle } from "lucide-react";
import Link from "next/link";

const EXAMPLES = [
  { label: "🎵 Fairuz — Li Beirut",       text: "Fairuz Li Beirut — nostalgic Arabic melancholy, cedar forests, golden Beirut at dusk" },
  { label: "🎬 Call Me By Your Name",      text: "Call Me By Your Name — Italian summer, peach light, longing, Sufjan Stevens guitar" },
  { label: "🎵 Oum Kalthoum",             text: "Oum Kalthoum — timeless Egyptian romance, silk curtains, warm candlelight, deep emotion" },
  { label: "🌊 Santorini sunset",          text: "Golden hour in Santorini, blue domes, warm Aegean breeze, white stone and bougainvillea" },
  { label: "🎵 Coldplay — Yellow",         text: "Coldplay Yellow — stars, wonder, pure love, hopeful blue and silver, cosmic tender" },
  { label: "🌸 Sidi Bou Said",             text: "Sidi Bou Said Tunisia — blue doors, jasmine, Mediterranean magic, white walls and gold light" },
];

const STEPS = [
  "Reading the vibe…",
  "Building visual worlds…",
  "Crafting three concepts…",
  "Adding finishing touches…",
];

interface Theme {
  name: string; tagline: string; mood: string;
  colorPalette: Record<string, string>;
  visualDescription: string; musicSuggestion: string; uniqueDetail: string;
}
interface VibeResult {
  interpretation: string;
  themes: Theme[];
}

export function VibeGeneratorSection() {
  const [vibe, setVibe]       = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [error, setError]     = useState("");
  const [result, setResult]   = useState<VibeResult | null>(null);

  const generate = async () => {
    if (!vibe.trim()) return;
    setLoading(true); setResult(null); setError(""); setStepIdx(0);
    const iv = setInterval(() => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1)), 900);
    try {
      const res  = await fetch("/api/ai/vibe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe }),
      });
      const text = await res.text();
      if (!text) { setError("No response from AI. Check that GEMINI_API_KEY is set in Vercel environment variables."); return; }
      const data = JSON.parse(text);
      if (res.ok) setResult(data);
      else setError(data.detail ?? "AI generation failed — check Vercel logs");
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Unknown error"}. Is GEMINI_API_KEY set in Vercel?`);
    } finally { clearInterval(iv); setLoading(false); }
  };

  return (
    <section id="vibe" className="py-16 sm:py-28 bg-[#080604]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/20 text-[10px] uppercase tracking-[0.25em] text-gold mb-6">
            <Wand2 size={12} /> AI Vibe & Song Engine
          </div>
          <h2 className="font-cormorant text-[clamp(2rem,4vw,3.5rem)] font-light leading-tight">
            Describe a song, a feeling,<br /><em className="italic text-gold">watch it become an invitation</em>
          </h2>
          <p className="text-sm text-cream/45 max-w-lg mx-auto mt-4 leading-relaxed">
            Type any song name, movie, mood, or place. Our AI reads the emotional fingerprint and creates 3 complete invitation worlds with matching colors, typography, and music.
          </p>
        </motion.div>

        {/* Quick examples */}
        <div className="flex flex-wrap gap-2 mb-4">
          {EXAMPLES.map((ex) => (
            <button key={ex.label} onClick={() => setVibe(ex.text)}
              className={`px-3 py-1.5 text-[11px] border transition-all rounded-sm ${
                vibe === ex.text ? "border-gold text-gold bg-gold/10" : "border-gold/15 text-cream/40 hover:border-gold/40 hover:text-cream/70"
              }`}>
              {ex.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <motion.div className="bg-gold/[0.04] border border-gold/25 p-5 sm:p-6 mb-4"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-3">
            <Music size={13} className="text-gold/60" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60">Song · Movie · Mood · Place</span>
          </div>
          <textarea value={vibe} onChange={(e) => setVibe(e.target.value)} rows={3}
            placeholder="e.g. 'Fairuz — Nassam Alayna El Hawa', 'Pride & Prejudice', 'rainy Paris café autumn', 'Sidi Bou Said at sunset'…"
            className="w-full bg-transparent text-cream text-sm outline-none resize-none placeholder:text-cream/25 tracking-wide leading-relaxed" />
        </motion.div>

        <button onClick={generate} disabled={loading || !vibe.trim()}
          className="w-full py-4 bg-gradient-to-r from-gold to-[#A8893A] text-deep text-xs uppercase tracking-[0.25em] font-medium hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]">
          <Sparkles size={14} />
          {loading ? STEPS[stepIdx] : "✦ Generate 3 Creative Themes ✦"}
        </button>

        {/* Error */}
        {error && (
          <motion.div className="mt-4 flex gap-3 px-4 py-3 border border-red-500/30 bg-red-500/5 text-xs text-red-400"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Loading shimmer */}
        {loading && (
          <div className="mt-6 space-y-3">
            {[1,2,3].map((i) => <div key={i} className="h-28 bg-cream/5 border border-gold/8 animate-pulse" />)}
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div className="mt-6 space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex gap-3 px-4 py-3 bg-gold/[0.06] border-l-2 border-gold/50">
                <Sparkles size={13} className="text-gold shrink-0 mt-0.5" />
                <p className="text-sm text-cream/65 italic leading-relaxed">{result.interpretation}</p>
              </div>

              {result.themes?.map((theme, i) => (
                <motion.div key={i} className="border border-gold/15 overflow-hidden"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
                  {/* Color bar */}
                  <div className="h-1.5 flex">
                    {Object.values(theme.colorPalette).map((c, j) => (
                      <div key={j} className="flex-1" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="p-4 sm:p-5" style={{ background: theme.colorPalette.background + "33" }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 block mb-1">Theme {i + 1} · {theme.mood}</span>
                        <h4 className="font-cormorant text-xl font-light text-cream">{theme.name}</h4>
                        <p className="text-xs text-cream/45 italic mt-0.5">{theme.tagline}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0 ml-3">
                        {["primary","accent","secondary"].map((k) => (
                          <div key={k} className="w-5 h-5 rounded-full border border-white/10" style={{ background: theme.colorPalette[k] }} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-cream/50 leading-relaxed mb-3">{theme.visualDescription}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gold/10">
                      <div className="flex items-center gap-1.5">
                        <Music size={10} className="text-gold/50" />
                        <span className="text-[10px] text-cream/35">{theme.musicSuggestion}</span>
                      </div>
                      <Link href="/register"
                        className="text-[10px] uppercase tracking-[0.15em] text-gold hover:underline">
                        Use theme →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="text-center pt-4 pb-2">
                <Link href="/register" className="inline-block px-8 py-3.5 bg-gold text-deep text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors">
                  ✦ Start Building Your Invitation ✦
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

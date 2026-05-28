"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Upload, X, Sparkles, RefreshCw } from "lucide-react";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { SpecRenderer } from "@/components/invitation/generated/SpecRenderer";

const STYLE_PRESETS = [
  { id:"tunisian",  label:"🇹🇳 Tunisian Wedding",  desc:"Andalusian, medina, jasmine, gold"  },
  { id:"arabic",    label:"🌙 Arabic Luxury",       desc:"Oriental, calligraphy, arabesque"   },
  { id:"french",    label:"🇫🇷 French Elegance",    desc:"Paris, minimal, sophisticated"      },
  { id:"garden",    label:"🌸 Garden Romance",      desc:"Floral, botanical, soft light"      },
  { id:"cinematic", label:"🎬 Cinematic Dark",      desc:"Film noir, dramatic, modern"        },
  { id:"bohemian",  label:"✨ Boho Celestial",      desc:"Stars, moon, earthy textures"       },
  { id:"royal",     label:"👑 Royal Palace",        desc:"Regal, marble, velvet, gold"        },
  { id:"coastal",   label:"🌊 Mediterranean Coast", desc:"Sea, tiles, warm breeze"            },
];

const STEPS = [
  "Reading your vision…","Designing the layout…","Choosing the palette…",
  "Writing the invitation text…","Adding cultural details…","Finalizing the concept…",
];

interface Props {
  invitationId: string;
  coupleName?: string;
  eventDate?: string;
  venue?: string;
}

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale  = Math.min(1, 900 / img.width);
      const canvas = document.createElement("canvas");
      canvas.width  = img.width  * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.onerror = () => resolve(URL.createObjectURL(file));
    img.src = url;
  });
}

export function AIDesignStudio({ invitationId, coupleName, eventDate, venue }: Props) {
  const { updateField } = useInvitationStore();
  const [style, setStyle]         = useState("tunisian");
  const [customDesc, setCustomDesc] = useState("");
  const [culturalBg, setCulturalBg] = useState("");
  const [language, setLanguage]   = useState<"en"|"fr"|"ar">("en");
  const [photos, setPhotos]       = useState<string[]>([]);
  const [loading, setLoading]     = useState(false);
  const [stepIdx, setStepIdx]     = useState(0);
  const [spec, setSpec]           = useState<unknown | null>(null);
  const [error, setError]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const addPhotos = async (files: FileList) => {
    const list = Array.from(files).slice(0, 5 - photos.length);
    const compressed = await Promise.all(list.map(compressImage));
    setPhotos((p) => [...p, ...compressed]);
  };

  const generate = async () => {
    setLoading(true); setError(""); setSpec(null); setStepIdx(0);
    const iv = setInterval(() => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1)), 1100);
    try {
      const styleLabel = STYLE_PRESETS.find((s) => s.id === style)?.label ?? style;
      const res = await fetch("/api/ai/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          coupleName:         coupleName ?? "The Couple",
          eventDate:          eventDate  ?? new Date().toISOString(),
          venue:              venue      ?? "A Beautiful Venue",
          language, style: styleLabel,
          culturalBackground: culturalBg || styleLabel,
          additionalDetails:  customDesc,
        }),
      });
      const text = await res.text();
      let data: { spec?: unknown; detail?: string };
      try { data = JSON.parse(text); } catch { throw new Error("Empty response — try again"); }
      if (!res.ok) throw new Error(data.detail ?? "Failed");
      if (!data.spec) throw new Error("No design received");
      setSpec(data.spec);
      // Save spec to invitation store for persistence
      updateField("generatedHtml" as never, JSON.stringify({ __spec: true, spec: data.spec, photos }) as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <Sparkles size={15} className="text-gold" />
        <div>
          <p className="text-xs font-medium text-cream/80">AI Design Studio</p>
          <p className="text-[10px] text-cream/35">Generates a unique invitation from scratch</p>
        </div>
      </div>

      {/* Style */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 block mb-2">Style</span>
        <div className="grid grid-cols-2 gap-1.5">
          {STYLE_PRESETS.map((s) => (
            <button key={s.id} onClick={() => setStyle(s.id)}
              className={`text-left p-2.5 border transition-all ${style === s.id ? "border-gold/60 bg-gold/10" : "border-gold/10 hover:border-gold/30"}`}>
              <p className="text-[11px] text-cream/80">{s.label}</p>
              <p className="text-[9px] text-cream/30 mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cultural background */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 block mb-1.5">Cultural Background</span>
        <input value={culturalBg} onChange={(e) => setCulturalBg(e.target.value)}
          placeholder="e.g. Tunisian Andalusian, Sidi Bou Said, jasmine…"
          className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-xs px-3 py-2.5 outline-none placeholder:text-cream/20 focus:border-gold/40" />
      </div>

      {/* Language */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 block mb-1.5">Language</span>
        <div className="flex gap-1.5">
          {(["en","fr","ar"] as const).map((l) => (
            <button key={l} onClick={() => setLanguage(l)}
              className={`flex-1 py-2 text-[11px] uppercase tracking-[0.12em] border transition-all ${language === l ? "border-gold text-gold bg-gold/10" : "border-gold/15 text-cream/40"}`}>
              {l === "en" ? "EN" : l === "fr" ? "FR" : "عربي"}
            </button>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60">Photos ({photos.length}/5)</span>
          <button onClick={() => fileRef.current?.click()} disabled={photos.length >= 5}
            className="flex items-center gap-1 text-[10px] text-gold/60 hover:text-gold transition-colors disabled:opacity-30">
            <Upload size={10} /> Add
          </button>
        </div>
        {photos.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-2">
            {photos.map((src, i) => (
              <div key={i} className="relative w-12 h-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover opacity-80" />
                <button onClick={() => setPhotos((p) => p.filter((_,j) => j !== i))}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 flex items-center justify-center z-10">
                  <X size={9} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => { if (e.target.files) addPhotos(e.target.files); e.target.value = ""; }} />
        <p className="text-[9px] text-cream/20">Photos are embedded directly in the invitation design</p>
      </div>

      {/* Additional details */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 block mb-1.5">Details & Story</span>
        <textarea value={customDesc} onChange={(e) => setCustomDesc(e.target.value)} rows={4}
          placeholder="Dress code, couple story, ceremony details, special requests, family names…"
          className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-xs px-3 py-2.5 outline-none resize-none placeholder:text-cream/20 focus:border-gold/40 leading-relaxed" />
      </div>

      {/* Generate */}
      <button onClick={generate} disabled={loading}
        className="w-full py-3.5 bg-gradient-to-r from-gold to-[#A8893A] text-deep text-[11px] uppercase tracking-[0.2em] font-medium hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
        <Wand2 size={13} />
        {loading ? STEPS[stepIdx] : spec ? "Redesign" : "Generate Invitation"}
      </button>

      {loading && (
        <div className="space-y-2">
          <div className="h-px bg-gold/20 overflow-hidden">
            <motion.div className="h-full bg-gold w-1/2" animate={{ x: ["-100%", "200%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
          </div>
          <p className="text-[10px] text-center text-gold/50 animate-pulse">{STEPS[stepIdx]}</p>
        </div>
      )}

      {error && (
        <div className="px-3 py-2.5 border border-red-500/30 bg-red-500/5 text-[11px] text-red-400 flex items-center gap-2">
          {error}
          <button onClick={generate} className="ml-auto flex items-center gap-1 hover:text-red-300 shrink-0">
            <RefreshCw size={10} /> Retry
          </button>
        </div>
      )}

      {/* Preview hint when spec is ready */}
      {spec && !loading && (
        <motion.div
          className="px-3 py-2.5 border border-gold/25 bg-gold/5 text-[11px] text-gold/70 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          ✦ Design ready — see preview in canvas
        </motion.div>
      )}
    </div>
  );
}

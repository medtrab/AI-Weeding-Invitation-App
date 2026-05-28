"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Upload, X, Sparkles, RefreshCw, Eye, Code, Download } from "lucide-react";
import { GeneratedInvitation } from "@/components/invitation/generated/GeneratedInvitation";
import { useInvitationStore } from "@/stores/useInvitationStore";

const STYLE_PRESETS = [
  { id: "tunisian",   label: "🇹🇳 Tunisian Wedding",   desc: "Andalusian, medina, jasmine, gold" },
  { id: "arabic",     label: "🌙 Arabic Luxury",        desc: "Oriental, calligraphy, arabesque"  },
  { id: "french",     label: "🇫🇷 French Elegance",     desc: "Paris, minimal, sophisticated"     },
  { id: "garden",     label: "🌸 Garden Romance",       desc: "Floral, botanical, soft light"     },
  { id: "cinematic",  label: "🎬 Cinematic Dark",       desc: "Film noir, dramatic, modern"       },
  { id: "bohemian",   label: "✨ Boho Celestial",       desc: "Stars, moon, earthy textures"      },
  { id: "royal",      label: "👑 Royal Palace",         desc: "Regal, marble, velvet, gold"       },
  { id: "coastal",    label: "🌊 Mediterranean Coast",  desc: "Sea, tiles, warm breeze"           },
];

const STEPS = [
  "Reading your vision…",
  "Inventing the layout…",
  "Crafting animations…",
  "Writing invitation text…",
  "Adding cultural details…",
  "Polishing the design…",
  "Almost ready…",
];

interface Props {
  invitationId: string;
  coupleName?: string;
  eventDate?: string;
  venue?: string;
  onSaveHtml?: (html: string) => void;
}

export function AIDesignStudio({ invitationId, coupleName, eventDate, venue, onSaveHtml }: Props) {
  const [selectedStyle, setSelectedStyle] = useState("tunisian");
  const [customDesc, setCustomDesc]       = useState("");
  const [culturalBg, setCulturalBg]       = useState("");
  const [language, setLanguage]           = useState<"en" | "fr" | "ar">("en");
  const [photos, setPhotos]               = useState<string[]>([]);
  const [loading, setLoading]             = useState(false);
  const [stepIdx, setStepIdx]             = useState(0);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [error, setError]                 = useState("");
  const [view, setView]                   = useState<"preview" | "code">("preview");
  const { updateField }                    = useInvitationStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress & add photo as base64
  const addPhoto = async (file: File) => {
    const compressed = await compressImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPhotos((prev) => [...prev, url]);
    };
    reader.readAsDataURL(compressed);
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    setGeneratedHtml(null);
    setStepIdx(0);

    const iv = setInterval(() =>
      setStepIdx((i) => Math.min(i + 1, STEPS.length - 1)), 1200
    );

    try {
      const styleLabel = STYLE_PRESETS.find((s) => s.id === selectedStyle)?.label ?? selectedStyle;
      const res = await fetch("/api/ai/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          coupleName:         coupleName ?? "The Couple",
          eventDate:          eventDate  ?? new Date().toISOString(),
          venue:              venue      ?? "A Beautiful Venue",
          language,
          style:              styleLabel,
          culturalBackground: culturalBg || styleLabel,
          additionalDetails:  customDesc,
          photos,
        }),
      });

      const text = await res.text();
      let data: { html?: string; detail?: string };
      try { data = JSON.parse(text); }
      catch { data = { html: text }; }

      if (!res.ok) throw new Error(data.detail ?? "Generation failed");
      if (!data.html) throw new Error("No design generated");

      setGeneratedHtml(data.html);
      onSaveHtml?.(data.html);
      updateField("generatedHtml" as never, data.html as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  const downloadHtml = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `invitation-${invitationId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 border border-gold/30 flex items-center justify-center">
          <Sparkles size={16} className="text-gold" />
        </div>
        <div>
          <h3 className="font-cormorant text-xl font-light text-cream">AI Design Studio</h3>
          <p className="text-xs text-cream/40">AI generates a completely unique invitation layout</p>
        </div>
      </div>

      {/* Style presets */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 block mb-3">Style</span>
        <div className="grid grid-cols-2 gap-1.5">
          {STYLE_PRESETS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStyle(s.id)}
              className={`text-left p-2.5 border transition-all ${
                selectedStyle === s.id
                  ? "border-gold/60 bg-gold/10"
                  : "border-gold/10 hover:border-gold/30"
              }`}
            >
              <p className="text-xs text-cream/80 mb-0.5">{s.label}</p>
              <p className="text-[10px] text-cream/30">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cultural details */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 block mb-2">
          Cultural Background
        </span>
        <input
          value={culturalBg}
          onChange={(e) => setCulturalBg(e.target.value)}
          placeholder="e.g. Tunisian Andalusian, Lebanese mountain, Moroccan Fes…"
          className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-xs px-3 py-2.5 outline-none placeholder:text-cream/20 focus:border-gold/40"
        />
      </div>

      {/* Language */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 block mb-2">Language</span>
        <div className="flex gap-2">
          {(["en", "fr", "ar"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`flex-1 py-2 text-xs uppercase tracking-[0.15em] border transition-all ${
                language === l ? "border-gold text-gold bg-gold/10" : "border-gold/15 text-cream/40"
              }`}
            >
              {l === "en" ? "English" : l === "fr" ? "French" : "Arabic"}
            </button>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60">
            Photos ({photos.length}/5)
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={photos.length >= 5}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-gold/60 hover:text-gold transition-colors disabled:opacity-30"
          >
            <Upload size={11} /> Add Photo
          </button>
        </div>

        {photos.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {photos.map((photo, i) => (
              <div key={i} className="relative w-14 h-14">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="" className="w-full h-full object-cover" style={{ opacity: 0.8 }} />
                <button
                  onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 flex items-center justify-center"
                >
                  <X size={9} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []).slice(0, 5 - photos.length);
            for (const f of files) await addPhoto(f);
            e.target.value = "";
          }}
        />

        <p className="text-[10px] text-cream/20 mt-1.5">
          AI will embed your photos directly into the design
        </p>
      </div>

      {/* Additional details */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 block mb-2">
          Additional Details
        </span>
        <textarea
          value={customDesc}
          onChange={(e) => setCustomDesc(e.target.value)}
          rows={3}
          placeholder="Dress code, special requests, ceremony timeline, family names, love story…"
          className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-xs px-3 py-2.5 outline-none resize-none placeholder:text-cream/20 focus:border-gold/40 leading-relaxed"
        />
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-gold to-[#A8893A] text-deep text-xs uppercase tracking-[0.25em] font-medium hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <Wand2 size={14} />
        {loading ? STEPS[stepIdx] : generatedHtml ? "✦ Redesign" : "✦ Generate Unique Invitation"}
      </button>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 border border-red-500/30 bg-red-500/5 text-xs text-red-400 flex items-center gap-2">
          {error}
          <button onClick={generate} className="ml-auto flex items-center gap-1 hover:text-red-300">
            <RefreshCw size={11} /> Retry
          </button>
        </div>
      )}

      {/* Loading shimmer */}
      {loading && (
        <div className="space-y-2">
          <div className="h-px bg-gold/20 overflow-hidden">
            <motion.div className="h-full bg-gold" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
          </div>
          <p className="text-[10px] text-center text-gold/50 animate-pulse">{STEPS[stepIdx]}</p>
        </div>
      )}
    </div>
  );
}

// Image compression utility
async function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale  = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width  = img.width  * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(blob ? new File([blob], file.name, { type: "image/jpeg" }) : file),
        "image/jpeg", quality
      );
    };
    img.onerror = () => resolve(file);
    img.src = url;
  });
}

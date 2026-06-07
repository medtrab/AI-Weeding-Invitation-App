"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2, Upload, X, Sparkles, RefreshCw,
  Plus, Trash2, ChevronDown, ChevronUp, Edit3, Check,
} from "lucide-react";
import { useInvitationStore } from "@/stores/useInvitationStore";

// ── Style presets ──────────────────────────────────────────────────────────
const STYLE_PRESETS = [
  { id:"tunisian",  label:"🇹🇳 Tunisian",     desc:"Andalusian, jasmine, gold"     },
  { id:"arabic",    label:"🌙 Arabian",        desc:"Oriental, arabesque, calligraphy" },
  { id:"french",    label:"🇫🇷 French",        desc:"Paris, minimal, sophisticated" },
  { id:"garden",    label:"🌸 Garden",         desc:"Floral, botanical, soft light" },
  { id:"cinematic", label:"🎬 Cinematic",      desc:"Film, dramatic, modern"        },
  { id:"bohemian",  label:"✨ Boho",           desc:"Stars, moon, earthy textures"  },
  { id:"royal",     label:"👑 Royal",          desc:"Regal, marble, velvet, gold"   },
  { id:"coastal",   label:"🌊 Coastal",        desc:"Sea, tiles, warm breeze"       },
  { id:"anime",     label:"🎌 Anime/Manga",    desc:"Japanese cinematic, vibrant"   },
  { id:"fantasy",   label:"🧝 Fantasy",        desc:"Magical, mystical, enchanted"  },
  { id:"vintage",   label:"📷 Vintage",        desc:"Retro, warm film, nostalgic"   },
  { id:"custom",    label:"✍️ Custom",         desc:"Describe your own theme"       },
];

const STEPS = [
  "Reading your vision…",
  "Generating the scene image…",
  "Designing layout & palette…",
  "Writing invitation text…",
  "Finalizing details…",
];

// ── Section types the user can add ────────────────────────────────────────
const SECTION_TYPES = [
  { type: "cover",     label: "Cover / Hero",    icon: "🎨", hint: "Main visual with couple names" },
  { type: "story",     label: "Love Story",      icon: "💌", hint: "Your story as a couple" },
  { type: "welcome",   label: "Welcome Message", icon: "🤝", hint: "Message welcoming guests" },
  { type: "guest",     label: "Guest Greeting",  icon: "👤", hint: "Personalized guest message" },
  { type: "details",   label: "Date & Venue",    icon: "📅", hint: "Event details and countdown" },
  { type: "dresscode", label: "Dress Code",      icon: "👗", hint: "What to wear" },
  { type: "rsvp",      label: "RSVP",            icon: "✅", hint: "Guest confirmation" },
  { type: "message",   label: "Leave a Wish",    icon: "🕊️", hint: "Guest message box" },
  { type: "custom",    label: "Custom Section",  icon: "✨", hint: "Describe something unique" },
];

interface PromptSection {
  id: string;
  type: string;
  label: string;
  icon: string;
  content: string;  // User-filled content for this section
  enabled: boolean;
}

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

// ── Default sections pre-filled ───────────────────────────────────────────
function defaultSections(coupleName?: string, venue?: string): PromptSection[] {
  return [
    {
      id: "s1", type: "cover", label: "Cover / Hero", icon: "🎨",
      content: coupleName ? `Couple names: ${coupleName}` : "Names of bride and groom",
      enabled: true,
    },
    {
      id: "s2", type: "story", label: "Love Story", icon: "💌",
      content: "How did the couple meet? What makes their love story unique? Any special moments…",
      enabled: true,
    },
    {
      id: "s3", type: "guest", label: "Guest Greeting", icon: "👤",
      content: "Personalized message warmly inviting each guest to share in the celebration",
      enabled: true,
    },
    {
      id: "s4", type: "details", label: "Date & Venue", icon: "📅",
      content: venue ? `Venue: ${venue}. Include countdown timer, date and time.` : "Event details with countdown",
      enabled: true,
    },
    {
      id: "s5", type: "message", label: "Leave a Wish", icon: "🕊️",
      content: "Allow guests to write and send their wishes and blessings",
      enabled: true,
    },
  ];
}

// ── Editable generated content ────────────────────────────────────────────
interface EditableField {
  key: string;
  label: string;
  value: string;
}

function EditableContent({
  fields, onSave,
}: {
  fields: EditableField[];
  onSave: (updated: EditableField[]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(fields);

  const handleSave = () => {
    setEditing(false);
    onSave(draft);
  };

  return (
    <div className="border border-gold/20 bg-gold/[0.03] p-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold/60">Generated Content</p>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className="flex items-center gap-1 text-[10px] text-gold hover:text-gold-light transition-colors">
          {editing ? <><Check size={10} /> Save</> : <><Edit3 size={10} /> Edit</>}
        </button>
      </div>
      {draft.map((f, i) => (
        <div key={f.key}>
          <p className="text-[9px] uppercase tracking-[0.15em] text-cream/30 mb-1">{f.label}</p>
          {editing ? (
            <textarea
              value={f.value}
              onChange={e => setDraft(d => d.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
              rows={2}
              className="w-full bg-gold/[0.06] border border-gold/30 text-cream text-xs px-2 py-1.5 outline-none resize-none focus:border-gold/60 leading-relaxed"
            />
          ) : (
            <p className="text-xs text-cream/70 leading-relaxed line-clamp-3">{f.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Section card ───────────────────────────────────────────────────────────
function SectionCard({
  section, onUpdate, onRemove, onToggle,
}: {
  section: PromptSection;
  onUpdate: (id: string, content: string) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`border transition-all ${section.enabled ? "border-gold/20" : "border-gold/8 opacity-50"}`}>
      <div className="flex items-center gap-2 px-3 py-2">
        <button onClick={() => onToggle(section.id)}
          className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${section.enabled ? "border-gold/50 bg-gold/15" : "border-cream/20"}`}>
          {section.enabled && <Check size={9} className="text-gold" />}
        </button>
        <span className="text-base">{section.icon}</span>
        <span className="text-xs text-cream/80 flex-1 font-medium">{section.label}</span>
        <button onClick={() => onRemove(section.id)} className="text-cream/20 hover:text-red-400 transition-colors p-0.5">
          <Trash2 size={11} />
        </button>
        <button onClick={() => setOpen(!open)} className="text-cream/30 hover:text-cream transition-colors p-0.5">
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>
      <AnimatePresence>
        {open && section.enabled && (
          <motion.div className="px-3 pb-3"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <textarea
              value={section.content}
              onChange={e => onUpdate(section.id, e.target.value)}
              rows={2}
              placeholder={`Describe what you want in the ${section.label} section…`}
              className="w-full bg-gold/[0.04] border border-gold/15 text-cream text-xs px-2.5 py-2 outline-none resize-none placeholder:text-cream/20 focus:border-gold/35 leading-relaxed"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function AIDesignStudio({ invitationId, coupleName, eventDate, venue }: Props) {
  const { updateField } = useInvitationStore();

  // Form state
  const [style, setStyle]       = useState("tunisian");
  const [customTheme, setCustomTheme] = useState("");
  const [language, setLanguage] = useState<"en"|"fr"|"ar">("en");
  const [photos, setPhotos]     = useState<string[]>([]);
  const [sections, setSections] = useState<PromptSection[]>(defaultSections(coupleName, venue));
  const [showAddSection, setShowAddSection] = useState(false);

  // Generation state
  const [loading, setLoading]   = useState(false);
  const [stepIdx, setStepIdx]   = useState(0);
  const [error, setError]       = useState("");
  const [generated, setGenerated] = useState(false);

  // Editable generated fields
  const [editFields, setEditFields] = useState<EditableField[]>([]);
  const [bgImage, setBgImage]       = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const addPhotos = async (files: FileList) => {
    const list = Array.from(files).slice(0, 5 - photos.length);
    const compressed = await Promise.all(list.map(compressImage));
    setPhotos(p => [...p, ...compressed]);
  };

  const addSection = (type: string) => {
    const preset = SECTION_TYPES.find(s => s.type === type);
    if (!preset) return;
    setSections(s => [...s, {
      id: `s${Date.now()}`, type, label: preset.label, icon: preset.icon,
      content: preset.hint, enabled: true,
    }]);
    setShowAddSection(false);
  };

  const updateSection = (id: string, content: string) =>
    setSections(s => s.map(x => x.id === id ? { ...x, content } : x));
  const removeSection = (id: string) =>
    setSections(s => s.filter(x => x.id !== id));
  const toggleSection = (id: string) =>
    setSections(s => s.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x));

  // Build structured prompt from sections
  const buildPrompt = () => {
    const styleLabel = style === "custom" ? customTheme : (STYLE_PRESETS.find(s => s.id === style)?.label ?? style);
    const enabledSections = sections.filter(s => s.enabled);

    const sectionText = enabledSections.map(s =>
      `SECTION — ${s.label.toUpperCase()} (${s.type})\n${s.content}`
    ).join("\n\n");

    return `
WEDDING INVITATION DESIGN REQUEST

Style & Theme: ${styleLabel}${customTheme ? ` — ${customTheme}` : ""}
Language: ${language === "ar" ? "Arabic" : language === "fr" ? "French" : "English"}
Couple: ${coupleName || "The Couple"}
Date: ${eventDate ? new Date(eventDate).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" }) : "TBD"}
Venue: ${venue || "A Beautiful Venue"}

SECTIONS TO INCLUDE (generate content for each):
${sectionText}

${photos.length > 0 ? `Photos provided: ${photos.length} couple photos — incorporate into design` : ""}
`.trim();
  };

  const generate = async () => {
    setLoading(true); setError(""); setGenerated(false); setStepIdx(0);
    const iv = setInterval(() => setStepIdx(i => Math.min(i + 1, STEPS.length - 1)), 1200);

    try {
      const res = await fetch("/api/ai/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          coupleName:         coupleName ?? "The Couple",
          eventDate:          eventDate  ?? new Date().toISOString(),
          venue:              venue      ?? "A Beautiful Venue",
          language,
          style:              style === "custom" ? customTheme : (STYLE_PRESETS.find(s => s.id === style)?.label ?? style),
          culturalBackground: style === "custom" ? customTheme : undefined,
          additionalDetails:  buildPrompt(),
          photos,
        }),
      });

      const text = await res.text();
      let data: Record<string, unknown>;
      try { data = JSON.parse(text); } catch { throw new Error("Empty response — try again"); }
      if (!res.ok) throw new Error((data.detail as string) ?? "Failed");

      if (!data.spec) throw new Error("No design received");

      // Extract editable fields from spec
      const spec = data.spec as Record<string, unknown>;
      const fields: EditableField[] = [];
      const sects = (spec.sections as Array<Record<string, unknown>>) || [];

      sects.forEach(s => {
        if (s.heading)  fields.push({ key: `${s.type}_heading`, label: `${s.type} heading`, value: String(s.heading) });
        if (s.message)  fields.push({ key: `${s.type}_message`, label: `${s.type} message`, value: String(s.message) });
        if (s.quote)    fields.push({ key: `${s.type}_quote`,   label: `${s.type} quote`,   value: String(s.quote)   });
      });

      const coverSpec = (spec.coverSpec as Record<string, unknown>) || {};
      if (coverSpec.tagline)   fields.push({ key: "cover_tagline",   label: "Cover tagline",   value: String(coverSpec.tagline)   });
      if (coverSpec.storyText) fields.push({ key: "cover_story",     label: "Story text",      value: String(coverSpec.storyText) });

      setEditFields(fields);
      setBgImage(data.pollinationsUrl as string || data.imageData as string || null);
      setGenerated(true);

      // Save to store (auto-saves to DB)
      updateField("generatedHtml" as never, JSON.stringify({
        __cinematic: true, __spec: true,
        spec, photos,
        imageData:       data.imageData       || null,
        pollinationsUrl: data.pollinationsUrl || null,
        imagePrompt:     data.imagePrompt     || null,
      }) as never);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  // Save edited fields back to the spec
  const handleEditSave = (updated: EditableField[]) => {
    // Re-apply edited text to the invitation store generatedHtml
    // This patches the text content without changing the visual spec
    const raw = (useInvitationStore.getState().invitation as { generatedHtml?: string })?.generatedHtml;
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const spec = parsed.spec as Record<string, unknown>;
      const sects = (spec.sections as Array<Record<string, unknown>>) || [];

      updated.forEach(f => {
        const [stype, field] = f.key.split("_");
        const sect = sects.find(s => s.type === stype);
        if (sect && field) sect[field] = f.value;

        const coverSpec = spec.coverSpec as Record<string, unknown> | undefined;
        if (coverSpec && stype === "cover") coverSpec[field] = f.value;
      });

      updateField("generatedHtml" as never, JSON.stringify(parsed) as never);
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <Sparkles size={15} className="text-gold" />
        <div>
          <p className="text-xs font-medium text-cream/80">AI Design Studio</p>
          <p className="text-[10px] text-cream/35">Structure your invitation, then generate</p>
        </div>
      </div>

      {/* Style */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 block mb-2">Theme Style</span>
        <div className="grid grid-cols-2 gap-1">
          {STYLE_PRESETS.map(s => (
            <button key={s.id} onClick={() => setStyle(s.id)}
              className={`text-left p-2 border transition-all ${style === s.id ? "border-gold/60 bg-gold/10" : "border-gold/10 hover:border-gold/25"}`}>
              <p className="text-[11px] text-cream/80 leading-tight">{s.label}</p>
              <p className="text-[9px] text-cream/25 mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
        {style === "custom" && (
          <textarea value={customTheme} onChange={e => setCustomTheme(e.target.value)} rows={2}
            placeholder="Describe your unique theme in detail — e.g. Naruto ninja wedding with cherry blossoms and lanterns…"
            className="w-full mt-2 bg-gold/[0.04] border border-gold/30 text-cream text-xs px-3 py-2 outline-none resize-none placeholder:text-cream/20 focus:border-gold/50 leading-relaxed" />
        )}
      </div>

      {/* Language */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 block mb-1.5">Language</span>
        <div className="flex gap-1.5">
          {(["en","fr","ar"] as const).map(l => (
            <button key={l} onClick={() => setLanguage(l)}
              className={`flex-1 py-2 text-[11px] uppercase tracking-[0.12em] border transition-all ${language === l ? "border-gold text-gold bg-gold/10" : "border-gold/15 text-cream/40"}`}>
              {l === "en" ? "EN" : l === "fr" ? "FR" : "عربي"}
            </button>
          ))}
        </div>
      </div>

      {/* Sections — structured prompt */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60">Invitation Sections</span>
          <button onClick={() => setShowAddSection(!showAddSection)}
            className="flex items-center gap-1 text-[10px] text-gold/60 hover:text-gold transition-colors">
            <Plus size={11} /> Add Section
          </button>
        </div>

        {/* Add section picker */}
        <AnimatePresence>
          {showAddSection && (
            <motion.div className="mb-2 border border-gold/20 bg-gold/[0.03] p-2 grid grid-cols-2 gap-1"
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}>
              {SECTION_TYPES.map(t => (
                <button key={t.type} onClick={() => addSection(t.type)}
                  className="text-left p-2 hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-all">
                  <p className="text-xs text-cream/70">{t.icon} {t.label}</p>
                  <p className="text-[9px] text-cream/25">{t.hint}</p>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1.5">
          {sections.map(s => (
            <SectionCard key={s.id} section={s}
              onUpdate={updateSection} onRemove={removeSection} onToggle={toggleSection} />
          ))}
        </div>
      </div>

      {/* Photos */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60">Couple Photos ({photos.length}/5)</span>
          <button onClick={() => fileRef.current?.click()} disabled={photos.length >= 5}
            className="flex items-center gap-1 text-[10px] text-gold/60 hover:text-gold transition-colors disabled:opacity-30">
            <Upload size={10} /> Add
          </button>
        </div>
        {photos.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {photos.map((src, i) => (
              <div key={i} className="relative w-12 h-12">
                <img src={src} alt="" className="w-full h-full object-cover opacity-80" />
                <button onClick={() => setPhotos(p => p.filter((_,j) => j !== i))}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 flex items-center justify-center">
                  <X size={9} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => { if (e.target.files) addPhotos(e.target.files); e.target.value = ""; }} />
      </div>

      {/* Generate button */}
      <button onClick={generate} disabled={loading}
        className="w-full py-3.5 bg-gradient-to-r from-gold to-[#A8893A] text-deep text-[11px] uppercase tracking-[0.2em] font-medium hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
        <Wand2 size={13} />
        {loading ? STEPS[stepIdx] : generated ? "✦ Regenerate" : "✦ Generate Invitation"}
      </button>

      {/* Progress */}
      {loading && (
        <div className="space-y-2">
          <div className="h-px bg-gold/20 overflow-hidden">
            <motion.div className="h-full bg-gold"
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: STEPS.length * 1.2, ease: "linear" }} />
          </div>
          <p className="text-[10px] text-center text-gold/50 animate-pulse">{STEPS[stepIdx]}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-3 py-2.5 border border-red-500/30 bg-red-500/5 text-[11px] text-red-400 flex items-center gap-2">
          {error}
          <button onClick={generate} className="ml-auto flex items-center gap-1 hover:text-red-300">
            <RefreshCw size={10} /> Retry
          </button>
        </div>
      )}

      {/* Generated image preview */}
      {bgImage && !loading && (
        <div className="relative overflow-hidden border border-gold/20" style={{ height: 180 }}>
          <img src={bgImage} alt="Generated scene" className="w-full h-full object-cover"
            style={{ filter: "brightness(0.75) saturate(1.2)" }}
            onError={() => setBgImage(null)} />
          <div className="absolute inset-0 flex items-end p-2.5"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }}>
            <p className="text-[10px] text-white/60 uppercase tracking-[0.15em]">✦ AI Scene — {style}</p>
          </div>
        </div>
      )}

      {/* Editable generated content */}
      {generated && !loading && editFields.length > 0 && (
        <EditableContent fields={editFields} onSave={handleEditSave} />
      )}

      {/* Success hint */}
      {generated && !loading && (
        <motion.div className="px-3 py-2.5 border border-gold/25 bg-gold/5 text-[11px] text-gold/70 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          ✦ Design ready — preview in canvas · Edit text above
        </motion.div>
      )}
    </div>
  );
}

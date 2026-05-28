"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const EVENT_TYPES = [
  { value:"wedding",     label:"💍 Wedding"        },
  { value:"engagement",  label:"💌 Engagement"     },
  { value:"birthday",    label:"🎂 Birthday"        },
  { value:"corporate",   label:"🏛️ Corporate Event" },
  { value:"baby_shower", label:"🍼 Baby Shower"     },
  { value:"graduation",  label:"🎓 Graduation"      },
  { value:"vip",         label:"⭐ VIP Event"       },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function NewInvitationModal({ isOpen, onClose }: Props) {
  const router  = useRouter();
  const [title,     setTitle]     = useState("");
  const [eventType, setEventType] = useState("wedding");
  const [coupleName,setCoupleName]= useState("");
  const [eventDate, setEventDate] = useState("");
  const [venue,     setVenue]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          eventType,
          coupleName: coupleName || undefined,
          eventDate:  new Date(eventDate).toISOString(),
          venue,
          language:  "en",
          textStyle: "luxury",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail ?? "Failed to create invitation");
      }

      const invitation = await res.json();
      router.push(`/builder/${invitation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-gradient-to-br from-[#1A160E] to-[#0D0B08] border border-gold/25 p-8 z-10">
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream/30 hover:text-gold transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="font-cormorant text-3xl font-light text-cream mb-1">
          New Invitation
        </h2>
        <p className="text-xs text-cream/40 tracking-wide mb-6">
          Fill in the basics — you can customise everything in the builder
        </p>

        {error && (
          <div className="mb-4 px-4 py-2.5 border border-red-500/30 bg-red-500/5 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event type */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-1.5">
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full bg-[#1A1608] border border-gold/20 text-cream text-sm px-4 py-3 outline-none cursor-pointer"
            >
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}
                  style={{ background: "#1A1608", color: "#FAF7F2" }}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-1.5">
              Invitation Title *
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sofia & Élias Wedding"
              className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-sm px-4 py-3 outline-none placeholder:text-cream/20 focus:border-gold/60 transition-colors"
            />
          </div>

          {/* Couple / person name */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-1.5">
              {eventType === "wedding" || eventType === "engagement"
                ? "Couple Names (optional)"
                : "Host Name (optional)"}
            </label>
            <input
              value={coupleName}
              onChange={(e) => setCoupleName(e.target.value)}
              placeholder={
                eventType === "wedding" ? "Sofia & Élias" : "Your name"
              }
              className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-sm px-4 py-3 outline-none placeholder:text-cream/20 focus:border-gold/60 transition-colors"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-1.5">
              Event Date *
            </label>
            <input
              required
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-sm px-4 py-3 outline-none focus:border-gold/60 transition-colors"
              style={{ colorScheme: "dark" }}
            />
          </div>

          {/* Venue */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-1.5">
              Venue *
            </label>
            <input
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Villa Majestic, Paris"
              className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-sm px-4 py-3 outline-none placeholder:text-cream/20 focus:border-gold/60 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gold text-deep text-xs uppercase tracking-[0.25em] font-medium hover:bg-gold-light transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Creating…" : "Create & Open Builder →"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Users, Plus, Upload, Send, QrCode, BarChart2,
  Crown, Check, X, Clock, Eye, Music2,
  Phone, Mail, Tag, Trash2, Download, Search,
  MessageCircle, ChevronDown, ChevronUp, Filter,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface GuestAnalytic { id: string; event: string; createdAt: string }
interface Guest {
  id: string; name: string; phone?: string; email?: string;
  relationship: string; isVip: boolean; tableNumber?: string;
  token: string; sendStatus: string; sentAt?: string;
  analytics: GuestAnalytic[];
}
interface Invitation {
  id: string; slug: string; coupleName?: string; title: string;
  venue: string; status: string; guests: Guest[];
}

// ── Stats card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color = "#C9A84C" }: {
  label: string; value: number | string; icon: React.ElementType; color?: string;
}) {
  return (
    <div className="bg-gold/[0.04] border border-gold/15 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40">{label}</span>
        <Icon size={14} style={{ color }} opacity={0.6} />
      </div>
      <p className="font-cormorant text-3xl font-light" style={{ color }}>{value}</p>
    </div>
  );
}

// ── Guest row ──────────────────────────────────────────────────────────────
function GuestRow({ guest, invitationSlug, baseUrl, onDelete, onSend }: {
  guest: Guest; invitationSlug: string; baseUrl: string;
  onDelete: (id: string) => void;
  onSend: (guest: Guest) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const opened  = guest.analytics.some(a => a.event === "opened");
  const rsvped  = guest.analytics.some(a => a.event === "rsvp_clicked");
  const musical = guest.analytics.some(a => a.event === "music_played");
  const inviteUrl = `${baseUrl}/i/${invitationSlug}?g=${guest.token}`;

  const statusColor = {
    pending:   "text-cream/30",
    sent:      "text-blue-400",
    failed:    "text-red-400",
    scheduled: "text-yellow-400",
  }[guest.sendStatus] || "text-cream/30";

  return (
    <motion.div
      className={`border-b border-gold/8 ${guest.isVip ? "bg-gold/[0.03]" : ""}`}
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>

      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
          guest.isVip ? "bg-gold/20 text-gold border border-gold/30" : "bg-cream/5 text-cream/50"
        }`}>
          {guest.isVip ? <Crown size={12} /> : guest.name[0].toUpperCase()}
        </div>

        {/* Name + tags */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-cream font-medium truncate">{guest.name}</span>
            {guest.isVip && (
              <span className="text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 bg-gold/15 text-gold border border-gold/20">VIP</span>
            )}
            <span className={`text-[9px] uppercase tracking-[0.1em] ${statusColor}`}>
              {guest.sendStatus}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {guest.phone && <span className="text-[10px] text-cream/30 truncate">{guest.phone}</span>}
            {guest.email && <span className="text-[10px] text-cream/25 truncate">{guest.email}</span>}
          </div>
        </div>

        {/* Analytics badges */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span title="Opened" className={`w-5 h-5 rounded-full flex items-center justify-center ${opened ? "bg-green-500/20 text-green-400" : "bg-cream/5 text-cream/20"}`}>
            <Eye size={10} />
          </span>
          <span title="RSVP" className={`w-5 h-5 rounded-full flex items-center justify-center ${rsvped ? "bg-blue-500/20 text-blue-400" : "bg-cream/5 text-cream/20"}`}>
            <Check size={10} />
          </span>
          <span title="Music" className={`w-5 h-5 rounded-full flex items-center justify-center ${musical ? "bg-purple-500/20 text-purple-400" : "bg-cream/5 text-cream/20"}`}>
            <Music2 size={10} />
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onSend(guest)}
            className="p-1.5 hover:text-green-400 text-cream/30 transition-colors" title="Send WhatsApp">
            <MessageCircle size={14} />
          </button>
          <button onClick={() => setExpanded(!expanded)}
            className="p-1.5 hover:text-gold text-cream/30 transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={() => onDelete(guest.id)}
            className="p-1.5 hover:text-red-400 text-cream/30 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="px-4 pb-4 pt-1 bg-cream/[0.02] border-t border-gold/8"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-gold/50 mb-1">Personal Link</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-cream/40 truncate flex-1 font-mono">{inviteUrl}</p>
                  <button onClick={() => navigator.clipboard.writeText(inviteUrl)}
                    className="text-[10px] text-gold hover:underline shrink-0">Copy</button>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-gold/50 mb-1">QR Code</p>
                <a href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-gold hover:underline flex items-center gap-1">
                  <QrCode size={11} /> View QR Code
                </a>
              </div>
            </div>
            {guest.analytics.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-gold/50 mb-1">Recent Activity</p>
                <div className="space-y-1">
                  {guest.analytics.slice(0, 4).map(a => (
                    <div key={a.id} className="flex items-center gap-2 text-xs text-cream/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                      <span className="capitalize">{a.event.replace(/_/g, " ")}</span>
                      <span className="ml-auto text-[10px]">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Add guest modal ────────────────────────────────────────────────────────
function AddGuestModal({ invitationId, onClose, onAdded }: {
  invitationId: string; onClose: () => void; onAdded: (g: Guest) => void;
}) {
  const [name, setName]         = useState("");
  const [phone, setPhone]       = useState("");
  const [email, setEmail]       = useState("");
  const [rel, setRel]           = useState("other");
  const [isVip, setIsVip]       = useState(false);
  const [loading, setLoading]   = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/invitations/${invitationId}/guests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, relationship: rel, isVip }),
    });
    const guest = await res.json();
    onAdded(guest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <motion.div className="w-full sm:max-w-md bg-[#0D0B08] border border-gold/25 p-6 rounded-t-2xl sm:rounded-none"
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-cormorant text-xl text-cream font-light">Add Guest</h3>
          <button onClick={onClose} className="text-cream/40 hover:text-cream"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          {[
            { label: "Full Name *", value: name, set: setName, type: "text", placeholder: "Ahmed Sami" },
            { label: "Phone (WhatsApp)", value: phone, set: setPhone, type: "tel", placeholder: "+216 XX XXX XXX" },
            { label: "Email", value: email, set: setEmail, type: "email", placeholder: "ahmed@example.com" },
          ].map(f => (
            <div key={f.label}>
              <label className="text-[10px] uppercase tracking-[0.15em] text-gold/60 block mb-1">{f.label}</label>
              <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)}
                placeholder={f.placeholder}
                className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-base sm:text-sm px-3 py-2.5 outline-none placeholder:text-cream/20 focus:border-gold/40 transition-colors" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-gold/60 block mb-1">Relationship</label>
              <select value={rel} onChange={e => setRel(e.target.value)}
                className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-sm px-3 py-2.5 outline-none focus:border-gold/40">
                {["family","friend","colleague","vip","other"].map(r => (
                  <option key={r} value={r} className="bg-[#0D0B08]">{r.charAt(0).toUpperCase()+r.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setIsVip(!isVip)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${isVip ? "bg-gold" : "bg-cream/10"}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isVip ? "left-5" : "left-1"}`} />
                </div>
                <span className="text-xs text-cream/60">VIP Guest</span>
              </label>
            </div>
          </div>
        </div>
        <button onClick={submit} disabled={!name.trim() || loading}
          className="w-full mt-5 py-3.5 bg-gold text-deep text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors disabled:opacity-40">
          {loading ? "Adding…" : "Add Guest ✦"}
        </button>
      </motion.div>
    </div>
  );
}

// ── CSV Import modal ───────────────────────────────────────────────────────
function ImportModal({ invitationId, onClose, onImported }: {
  invitationId: string; onClose: () => void; onImported: (count: number) => void;
}) {
  const [csv, setCsv]         = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Array<{ name: string; phone: string; email: string }>>([]);

  const parseCsv = (text: string) => {
    setCsv(text);
    const lines = text.trim().split("\n").slice(1); // skip header
    const parsed = lines.map(line => {
      const [name = "", phone = "", email = ""] = line.split(",").map(s => s.trim().replace(/^"|"$/g, ""));
      return { name, phone, email };
    }).filter(r => r.name);
    setPreview(parsed.slice(0, 5));
    return parsed;
  };

  const importGuests = async () => {
    const parsed = parseCsv(csv);
    if (!parsed.length) return;
    setLoading(true);
    const res = await fetch(`/api/invitations/${invitationId}/guests/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guests: parsed }),
    });
    const data = await res.json();
    onImported(data.created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <motion.div className="w-full sm:max-w-lg bg-[#0D0B08] border border-gold/25 p-6 max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-none"
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-cormorant text-xl text-cream font-light">Import Guests (CSV)</h3>
          <button onClick={onClose} className="text-cream/40 hover:text-cream"><X size={18} /></button>
        </div>
        <div className="mb-4 p-3 bg-gold/5 border border-gold/15 text-xs text-cream/50 leading-relaxed">
          <p className="font-medium text-gold/70 mb-1">CSV Format:</p>
          <code className="text-cream/40">name,phone,email<br/>Ahmed Sami,+21698765432,ahmed@example.com<br/>Fatma Ben Ali,+21655443322,</code>
        </div>
        <textarea value={csv} onChange={e => parseCsv(e.target.value)} rows={8}
          placeholder={"name,phone,email\nAhmed Sami,+216XXXXXXXX,ahmed@example.com"}
          className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-xs px-3 py-2.5 outline-none resize-none placeholder:text-cream/20 focus:border-gold/40 font-mono" />
        {preview.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] uppercase tracking-[0.15em] text-gold/50 mb-2">Preview ({preview.length}+ guests)</p>
            <div className="space-y-1">
              {preview.map((r, i) => (
                <div key={i} className="flex gap-3 text-xs text-cream/50 py-1 border-b border-gold/8">
                  <span className="flex-1">{r.name}</span>
                  <span className="text-cream/30">{r.phone}</span>
                  <span className="text-cream/25">{r.email}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={importGuests} disabled={!csv.trim() || loading}
          className="w-full mt-4 py-3.5 bg-gold text-deep text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors disabled:opacity-40">
          {loading ? "Importing…" : `Import ${preview.length ? preview.length + "+ " : ""}Guests ✦`}
        </button>
      </motion.div>
    </div>
  );
}

// ── Send panel ─────────────────────────────────────────────────────────────
function SendPanel({ invitation, guests, selected, onClose }: {
  invitation: Invitation; guests: Guest[];
  selected: string[]; onClose: () => void;
}) {
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState<Array<{ guestName: string; whatsappUrl: string | null; message: string }>>([]);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const send = async () => {
    setLoading(true);
    const res = await fetch(`/api/invitations/${invitation.id}/guests/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestIds: selected }),
    });
    const data = await res.json();
    setResults(data.results);
    setLoading(false);
  };

  const selectedGuests = guests.filter(g => selected.includes(g.id));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <motion.div className="w-full sm:max-w-lg bg-[#0D0B08] border border-gold/25 p-6 max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-none"
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-cormorant text-xl text-cream font-light">Send Invitations</h3>
          <button onClick={onClose} className="text-cream/40 hover:text-cream"><X size={18} /></button>
        </div>

        {results.length === 0 ? (
          <>
            <p className="text-sm text-cream/50 mb-4">
              Sending to <span className="text-gold">{selected.length} guest{selected.length !== 1 ? "s" : ""}</span>
            </p>
            <div className="space-y-2 mb-5 max-h-40 overflow-y-auto">
              {selectedGuests.map(g => (
                <div key={g.id} className="flex items-center gap-2 text-sm text-cream/60 py-1.5 border-b border-gold/8">
                  {g.isVip && <Crown size={10} className="text-gold" />}
                  <span>{g.name}</span>
                  {g.phone ? <span className="text-cream/30 text-xs ml-auto">{g.phone}</span>
                           : <span className="text-red-400/50 text-xs ml-auto">No phone</span>}
                </div>
              ))}
            </div>
            <button onClick={send} disabled={loading}
              className="w-full py-4 bg-green-600 hover:bg-green-500 text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
              <MessageCircle size={14} />
              {loading ? "Generating links…" : "Generate WhatsApp Links ✦"}
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-green-400 mb-4">✓ {results.length} personalized links generated</p>
            {results.map((r, i) => (
              <div key={i} className="border border-gold/15 p-3">
                <p className="text-sm text-cream mb-2 font-medium">{r.guestName}</p>
                {r.whatsappUrl ? (
                  <a href={r.whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs uppercase tracking-[0.15em] transition-colors w-full justify-center">
                    <MessageCircle size={12} /> Open WhatsApp
                  </a>
                ) : (
                  <div>
                    <p className="text-[10px] text-cream/30 mb-1">No phone — copy link:</p>
                    <div className="flex gap-2">
                      <input readOnly value={`${baseUrl}/i/${invitation.slug}?g=${guests.find(g=>g.name===r.guestName)?.token}`}
                        className="flex-1 bg-gold/[0.04] border border-gold/15 text-xs text-cream/40 px-2 py-1.5 outline-none font-mono" />
                      <button onClick={() => navigator.clipboard.writeText(`${baseUrl}/i/${invitation.slug}?g=${guests.find(g=>g.name===r.guestName)?.token || ""}`)}
                        className="px-2 py-1.5 bg-gold/15 text-gold text-xs hover:bg-gold/25 transition-colors">Copy</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export function GuestDashboard({ invitation }: { invitation: Invitation & { guests: Guest[] } }) {
  const [guests, setGuests]         = useState<Guest[]>(invitation.guests);
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState<"all"|"sent"|"pending"|"opened">("all");
  const [selected, setSelected]     = useState<string[]>([]);
  const [showAdd, setShowAdd]       = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showSend, setShowSend]     = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Stats
  const total   = guests.length;
  const sent    = guests.filter(g => g.sendStatus === "sent").length;
  const opened  = guests.filter(g => g.analytics.some(a => a.event === "opened")).length;
  const rsvped  = guests.filter(g => g.analytics.some(a => a.event === "rsvp_clicked")).length;

  // Filter + search
  const filtered = guests.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
                        (g.phone || "").includes(search) ||
                        (g.email || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all"    ? true
                      : filter === "sent"   ? g.sendStatus === "sent"
                      : filter === "pending"? g.sendStatus === "pending"
                      : filter === "opened" ? g.analytics.some(a => a.event === "opened")
                      : true;
    return matchSearch && matchFilter;
  });

  const toggleSelect = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const selectAll = () =>
    setSelected(filtered.length === selected.length ? [] : filtered.map(g => g.id));

  const deleteGuest = async (id: string) => {
    if (!confirm("Remove this guest?")) return;
    await fetch(`/api/guests/${id}`, { method: "DELETE" });
    setGuests(gs => gs.filter(g => g.id !== id));
    setSelected(s => s.filter(x => x !== id));
  };

  const addGuest = (g: Guest) => setGuests(gs => [g, ...gs]);

  // Export CSV
  const exportCsv = () => {
    const rows = [
      ["Name","Phone","Email","Relationship","VIP","Status","Opened","RSVP"],
      ...guests.map(g => [
        g.name, g.phone||"", g.email||"", g.relationship, g.isVip?"Yes":"No",
        g.sendStatus,
        g.analytics.some(a=>a.event==="opened")?"Yes":"No",
        g.analytics.some(a=>a.event==="rsvp_clicked")?"Yes":"No",
      ])
    ].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `guests-${invitation.id}.csv`; a.click();
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-5xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold/60 mb-1">Guest Manager</p>
            <h1 className="font-cormorant text-2xl sm:text-3xl font-light text-cream">
              {invitation.coupleName || invitation.title}
            </h1>
            {invitation.status !== "published" && (
              <p className="text-xs text-yellow-400/60 mt-1">⚠ Publish invitation before sending links</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button onClick={exportCsv}
              className="flex items-center gap-1.5 px-3 py-2 border border-gold/20 text-gold/60 text-xs hover:border-gold/40 hover:text-gold transition-all">
              <Download size={12} /> Export
            </button>
            <button onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 px-3 py-2 border border-gold/20 text-cream/60 text-xs hover:border-gold/40 transition-all">
              <Upload size={12} /> Import CSV
            </button>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gold text-deep text-xs uppercase tracking-[0.15em] hover:bg-gold-light transition-all">
              <Plus size={12} /> Add Guest
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
          <StatCard label="Total Guests"    value={total}  icon={Users}    />
          <StatCard label="Invitations Sent" value={sent}  icon={Send}     color="#60a5fa" />
          <StatCard label="Opened"           value={opened} icon={Eye}      color="#4ade80" />
          <StatCard label="RSVP'd"           value={rsvped} icon={Check}    color="#a78bfa" />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[160px] relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search guests…"
              className="w-full bg-gold/[0.04] border border-gold/15 text-cream text-sm pl-8 pr-3 py-2 outline-none placeholder:text-cream/20 focus:border-gold/30" />
          </div>

          {/* Filter chips */}
          <div className="flex gap-1">
            {(["all","sent","pending","opened"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-2.5 py-1.5 text-[10px] uppercase tracking-[0.1em] border transition-all ${
                  filter === f ? "border-gold text-gold bg-gold/10" : "border-gold/15 text-cream/30 hover:border-gold/30"
                }`}>
                {f}
              </button>
            ))}
          </div>

          {/* Bulk actions */}
          {selected.length > 0 && (
            <button onClick={() => setShowSend(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs transition-colors">
              <MessageCircle size={12} /> Send {selected.length}
            </button>
          )}
        </div>

        {/* Guest list */}
        <div className="border border-gold/15 overflow-hidden">
          {/* List header */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gold/10 bg-gold/[0.02]">
            <button onClick={selectAll} className="w-4 h-4 border border-gold/30 flex items-center justify-center">
              {selected.length === filtered.length && filtered.length > 0 && <Check size={10} className="text-gold" />}
            </button>
            <span className="text-[10px] uppercase tracking-[0.15em] text-cream/30 flex-1">
              {filtered.length} guest{filtered.length !== 1 ? "s" : ""}
              {selected.length > 0 && <span className="text-gold ml-2">· {selected.length} selected</span>}
            </span>
            <span className="text-[10px] text-cream/20 hidden sm:block">Opened · RSVP · Music</span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Users size={32} className="text-cream/15 mx-auto mb-3" />
              <p className="text-sm text-cream/30">
                {guests.length === 0 ? "No guests yet — add your first guest above" : "No guests match your search"}
              </p>
            </div>
          ) : (
            <div>
              {filtered.map(guest => (
                <div key={guest.id} className="flex items-start">
                  <div className="px-4 pt-3.5">
                    <button onClick={() => toggleSelect(guest.id)}
                      className="w-4 h-4 border border-gold/30 flex items-center justify-center shrink-0">
                      {selected.includes(guest.id) && <Check size={10} className="text-gold" />}
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <GuestRow
                      guest={guest}
                      invitationSlug={invitation.slug}
                      baseUrl={baseUrl}
                      onDelete={deleteGuest}
                      onSend={g => { setSelected([g.id]); setShowSend(true); }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAdd    && <AddGuestModal invitationId={invitation.id} onClose={() => setShowAdd(false)} onAdded={addGuest} />}
        {showImport && <ImportModal invitationId={invitation.id} onClose={() => setShowImport(false)} onImported={(n) => { window.location.reload(); }} />}
        {showSend   && <SendPanel invitation={invitation} guests={guests} selected={selected} onClose={() => setShowSend(false)} />}
      </AnimatePresence>
    </DashboardLayout>
  );
}

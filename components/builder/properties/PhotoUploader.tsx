"use client";
import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useInvitationStore } from "@/stores/useInvitationStore";

export function PhotoUploader() {
  const { invitation, updateField } = useInvitationStore();
  const coverRef = useRef<HTMLInputElement>(null);
  const bgRef    = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<"cover" | "background" | null>(null);

  if (!invitation) return null;

  const upload = async (file: File, type: "cover" | "background") => {
    setUploading(type);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", type === "cover" ? "covers" : "backgrounds");
      const res  = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (res.ok) {
        updateField(type === "cover" ? "coverImageUrl" : "backgroundImageUrl", data.url);
      } else {
        alert(data.detail ?? "Upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const PhotoSlot = ({
    label, field, inputRef, uploadType,
  }: {
    label: string;
    field: "coverImageUrl" | "backgroundImageUrl";
    inputRef: React.RefObject<HTMLInputElement>;
    uploadType: "cover" | "background";
  }) => {
    const current = invitation[field];
    return (
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40 block mb-2">{label}</span>
        <div
          className="relative h-24 border border-dashed border-gold/20 overflow-hidden cursor-pointer hover:border-gold/40 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          {current ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current} alt={label} className="w-full h-full object-cover opacity-70" />
              <button
                onClick={(e) => { e.stopPropagation(); updateField(field, ""); }}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 flex items-center justify-center text-white"
              >
                <X size={10} />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
              {uploading === uploadType ? (
                <div className="text-[10px] text-gold/60 animate-pulse">Uploading…</div>
              ) : (
                <>
                  <Upload size={16} className="text-gold/30" />
                  <span className="text-[10px] text-cream/25">Click to upload</span>
                </>
              )}
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, uploadType); }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <ImageIcon size={13} className="text-gold/60" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Photos</span>
      </div>
      <PhotoSlot
        label="Couple Photo (Hero)"
        field="coverImageUrl"
        inputRef={coverRef}
        uploadType="cover"
      />
      <PhotoSlot
        label="Background Image"
        field="backgroundImageUrl"
        inputRef={bgRef}
        uploadType="background"
      />
      <p className="text-[10px] text-cream/20 leading-relaxed">
        Couple photo appears as a full-bleed cinematic header. Background image adds depth behind text.
      </p>
    </div>
  );
}

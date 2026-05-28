"use client";
import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";
import { useInvitationStore } from "@/stores/useInvitationStore";

// Compress image to max 1200px and 800KB before upload
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
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => resolve(file);
    img.src = url;
  });
}

export function PhotoUploader() {
  const { invitation, updateField } = useInvitationStore();
  const coverRef = useRef<HTMLInputElement>(null);
  const bgRef    = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<"cover" | "background" | null>(null);
  const [status, setStatus]       = useState<Record<string, "ok" | "err">>({});

  if (!invitation) return null;

  const upload = async (file: File, type: "cover" | "background") => {
    setUploading(type);
    setStatus((s) => ({ ...s, [type]: undefined as never }));
    try {
      // Compress before upload
      const compressed = await compressImage(file);
      const form = new FormData();
      form.append("file", compressed);
      form.append("folder", type === "cover" ? "covers" : "backgrounds");

      const res  = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();

      if (res.ok) {
        updateField(type === "cover" ? "coverImageUrl" : "backgroundImageUrl", data.url);
        setStatus((s) => ({ ...s, [type]: "ok" }));
      } else {
        throw new Error(data.detail ?? "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setStatus((s) => ({ ...s, [type]: "err" }));
    } finally {
      setUploading(null);
    }
  };

  const PhotoSlot = ({
    label, hint, field, inputRef, uploadType,
  }: {
    label: string; hint: string;
    field: "coverImageUrl" | "backgroundImageUrl";
    inputRef: React.RefObject<HTMLInputElement>;
    uploadType: "cover" | "background";
  }) => {
    const current   = invitation[field];
    const isLoading = uploading === uploadType;
    const slotStatus = status[uploadType];

    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40">{label}</span>
          {slotStatus === "ok"  && <CheckCircle size={11} className="text-emerald-400" />}
          {slotStatus === "err" && <AlertCircle size={11} className="text-red-400" />}
        </div>

        <div
          className="relative h-28 border border-dashed overflow-hidden cursor-pointer transition-colors"
          style={{ borderColor: slotStatus === "err" ? "#f87171" : current ? "#C9A84C40" : "#C9A84C20" }}
          onClick={() => !isLoading && inputRef.current?.click()}
        >
          {current ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current}
                alt={label}
                className="w-full h-full object-cover"
                style={{ opacity: 0.75 }}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] uppercase tracking-widest text-white">Change Photo</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateField(field, "");
                  setStatus((s) => ({ ...s, [uploadType]: undefined as never }));
                }}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 flex items-center justify-center z-10"
              >
                <X size={11} className="text-white" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border border-gold/40 border-t-gold rounded-full animate-spin" />
                  <span className="text-[10px] text-gold/60 animate-pulse">Uploading…</span>
                </>
              ) : (
                <>
                  <Upload size={18} className="text-gold/30" />
                  <span className="text-[10px] text-cream/30">Click to upload</span>
                  <span className="text-[9px] text-cream/20">{hint}</span>
                </>
              )}
            </div>
          )}
        </div>

        {slotStatus === "err" && (
          <p className="text-[10px] text-red-400 mt-1">Upload failed — check file size (max 10MB)</p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f, uploadType);
            e.target.value = "";
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <ImageIcon size={13} className="text-gold/60" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60">Photos</span>
      </div>

      <PhotoSlot
        label="Couple Photo"
        hint="Appears as cinematic full-screen hero"
        field="coverImageUrl"
        inputRef={coverRef}
        uploadType="cover"
      />

      <PhotoSlot
        label="Background Image"
        hint="Adds atmospheric depth behind text"
        field="backgroundImageUrl"
        inputRef={bgRef}
        uploadType="background"
      />

      <div className="pt-2 border-t border-gold/10">
        <p className="text-[10px] text-cream/20 leading-relaxed">
          Images are auto-compressed before upload. JPG, PNG, WebP supported. Max 10MB.
          {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && (
            <span className="block mt-1 text-gold/40">
              ✓ Working in local mode — add Cloudinary credentials to .env for cloud storage.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

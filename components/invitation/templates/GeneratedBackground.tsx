"use client";
import { useEffect, useRef, useState } from "react";

// ── Generates a beautiful cinematic background using Canvas API ────────────
// Zero external dependencies. Works offline. Instant. Unique per theme.

interface Props {
  spec: {
    theme?: {
      palette?: { bg?: string; surface?: string; primary?: string; accent?: string };
      petalEmoji?: string;
      patternStyle?: string;
    };
    imagePrompt?: string;
  };
  width?: number;
  height?: number;
  onGenerated?: (dataUrl: string) => void;
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return [r, g, b];
}

function parsePromptColors(prompt: string): { primary: string; secondary: string; dark: string } {
  const p = prompt.toLowerCase();
  if (p.includes("blue") && p.includes("gold")) return { primary: "#1a3a6b", secondary: "#c9a84c", dark: "#0a1628" };
  if (p.includes("sakura") || p.includes("cherry")) return { primary: "#8b4d6e", secondary: "#f4b8c1", dark: "#1a0a14" };
  if (p.includes("night") || p.includes("dark") || p.includes("midnight")) return { primary: "#1a0a3e", secondary: "#6b4fc9", dark: "#050310" };
  if (p.includes("sunset") || p.includes("orange")) return { primary: "#8b2a0a", secondary: "#e8834c", dark: "#1a0a05" };
  if (p.includes("forest") || p.includes("green")) return { primary: "#0a3a1a", secondary: "#4c8b5e", dark: "#050f08" };
  if (p.includes("gold") || p.includes("royal")) return { primary: "#3a2a0a", secondary: "#c9a84c", dark: "#0a0805" };
  return { primary: "#0a1628", secondary: "#c9a84c", dark: "#050a14" };
}

export function GeneratedBackground({ spec, width = 1080, height = 1920, onGenerated }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = width;
    canvas.height = height;

    const p = spec.theme?.palette || {};
    const bg      = p.bg      || "#0a0e1a";
    const surface = p.surface || "#1a2440";
    const primary = p.primary || "#c9a84c";
    const accent  = p.accent  || "#e8c86a";

    const [bgR, bgG, bgB]   = hexToRgb(bg);
    const [sfR, sfG, sfB]   = hexToRgb(surface);
    const [prR, prG, prB]   = hexToRgb(primary);
    const [acR, acG, acB]   = hexToRgb(accent);

    const imagePrompt = spec.imagePrompt || "";
    const promptColors = parsePromptColors(imagePrompt);

    // ── Sky gradient ───────────────────────────────────────────────────────
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.65);
    skyGrad.addColorStop(0,    `rgb(${bgR * 0.3},${bgG * 0.3},${bgB * 0.3})`);
    skyGrad.addColorStop(0.3,  `rgb(${sfR},${sfG},${sfB})`);
    skyGrad.addColorStop(0.65, `rgb(${Math.min(bgR + 40, 255)},${Math.min(bgG + 20, 255)},${bgB})`);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // ── Atmospheric glow (sun/moon) ────────────────────────────────────────
    const cx = width * 0.5, cy = height * 0.28;
    const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.7);
    glowGrad.addColorStop(0,   `rgba(${prR},${prG},${prB},0.35)`);
    glowGrad.addColorStop(0.3, `rgba(${acR},${acG},${acB},0.15)`);
    glowGrad.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, width, height);

    // ── Ground/water gradient ──────────────────────────────────────────────
    const groundGrad = ctx.createLinearGradient(0, height * 0.55, 0, height);
    groundGrad.addColorStop(0,   `rgba(${bgR},${bgG},${bgB},0.9)`);
    groundGrad.addColorStop(0.3, `rgba(${bgR * 0.7 | 0},${bgG * 0.7 | 0},${bgB * 0.8 | 0},0.95)`);
    groundGrad.addColorStop(1,   `rgb(${bgR * 0.5 | 0},${bgG * 0.5 | 0},${bgB * 0.5 | 0})`);
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, height * 0.55, width, height * 0.45);

    // ── Stars ──────────────────────────────────────────────────────────────
    const rng = (seed: number) => { let s = seed; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; }; };
    const rand = rng(42);
    for (let i = 0; i < 200; i++) {
      const x = rand() * width;
      const y = rand() * height * 0.5;
      const r = rand() * 1.5 + 0.3;
      const a = rand() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,240,${a})`;
      ctx.fill();
    }

    // ── Architecture silhouettes ───────────────────────────────────────────
    const drawBuilding = (x: number, y: number, w: number, h: number, style: string) => {
      ctx.fillStyle = `rgba(${bgR * 0.3 | 0},${bgG * 0.3 | 0},${bgB * 0.3 | 0},0.9)`;
      if (style === "dome") {
        ctx.fillRect(x, y + h * 0.3, w, h * 0.7);
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h * 0.3, w / 2, h * 0.35, 0, Math.PI, 2 * Math.PI);
        ctx.fill();
        // Minaret
        ctx.fillRect(x + w * 0.1, y - h * 0.5, w * 0.15, h * 0.8);
        ctx.beginPath();
        ctx.moveTo(x + w * 0.1, y - h * 0.5);
        ctx.lineTo(x + w * 0.175, y - h * 0.7);
        ctx.lineTo(x + w * 0.25, y - h * 0.5);
        ctx.fill();
      } else if (style === "pagoda") {
        for (let tier = 0; tier < 4; tier++) {
          const tw = w * (1 - tier * 0.2), ty = y + tier * h * 0.2;
          ctx.fillRect(x + (w - tw) / 2, ty, tw, h * 0.25);
          ctx.beginPath();
          ctx.moveTo(x + (w - tw * 1.3) / 2, ty);
          ctx.lineTo(x + w / 2, ty - h * 0.08);
          ctx.lineTo(x + (w + tw * 1.3) / 2, ty);
          ctx.fill();
        }
      } else {
        // House/generic
        ctx.fillRect(x, y, w, h);
        ctx.beginPath();
        ctx.moveTo(x - w * 0.1, y);
        ctx.lineTo(x + w / 2, y - h * 0.4);
        ctx.lineTo(x + w * 1.1, y);
        ctx.fill();
      }
    };

    // Determine architecture style from prompt
    const prompt = imagePrompt.toLowerCase();
    const archStyle = prompt.includes("pagoda") || prompt.includes("japan") || prompt.includes("ninja") || prompt.includes("anime") ? "pagoda"
      : prompt.includes("mosque") || prompt.includes("arab") || prompt.includes("tunis") || prompt.includes("minaret") ? "dome"
      : "house";

    const rnd2 = rng(123);
    for (let i = 0; i < 8; i++) {
      const bx = rnd2() * width * 1.2 - width * 0.1;
      const bw = rnd2() * 80 + 40;
      const bh = rnd2() * 150 + 80;
      const by = height * 0.55 - bh;
      drawBuilding(bx, by, bw, bh, archStyle);
    }

    // ── Lanterns / lights ──────────────────────────────────────────────────
    const rnd3 = rng(456);
    for (let i = 0; i < 25; i++) {
      const lx = rnd3() * width;
      const ly = height * 0.2 + rnd3() * height * 0.5;
      const lr = rnd3() * 4 + 2;
      const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr * 8);
      glow.addColorStop(0,   `rgba(${prR},${prG},${prB},0.9)`);
      glow.addColorStop(0.5, `rgba(${acR},${acG},${acB},0.3)`);
      glow.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(lx - lr * 8, ly - lr * 8, lr * 16, lr * 16);
      ctx.beginPath();
      ctx.arc(lx, ly, lr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${prR},${prG},${prB},1)`;
      ctx.fill();
    }

    // ── Silhouettes of couple ──────────────────────────────────────────────
    const drawCouple = (cx: number, groundY: number) => {
      ctx.fillStyle = "rgba(5,8,15,0.95)";
      // Person 1 (slightly left)
      const p1x = cx - 28, ph = 190;
      ctx.beginPath();
      ctx.ellipse(p1x, groundY - ph, 22, 28, 0, 0, Math.PI * 2); // head
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(p1x - 18, groundY - ph + 25);
      ctx.quadraticCurveTo(p1x - 22, groundY - ph * 0.5, p1x - 12, groundY);
      ctx.lineTo(p1x + 12, groundY);
      ctx.quadraticCurveTo(p1x + 20, groundY - ph * 0.5, p1x + 18, groundY - ph + 25);
      ctx.closePath();
      ctx.fill();
      // Arms reaching toward person 2
      ctx.beginPath();
      ctx.moveTo(p1x + 18, groundY - ph * 0.65);
      ctx.lineTo(p1x + 45, groundY - ph * 0.58);
      ctx.lineWidth = 8;
      ctx.strokeStyle = "rgba(5,8,15,0.95)";
      ctx.stroke();

      // Person 2 (slightly right, flowing dress suggestion)
      const p2x = cx + 28;
      ctx.fillStyle = "rgba(8,12,22,0.95)";
      ctx.beginPath();
      ctx.ellipse(p2x, groundY - ph + 5, 20, 25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(p2x - 15, groundY - ph + 28);
      ctx.quadraticCurveTo(p2x - 35, groundY - ph * 0.4, p2x - 45, groundY);
      ctx.lineTo(p2x + 45, groundY);
      ctx.quadraticCurveTo(p2x + 22, groundY - ph * 0.4, p2x + 15, groundY - ph + 28);
      ctx.closePath();
      ctx.fill();
      // Connecting hands
      ctx.beginPath();
      ctx.moveTo(p2x - 15, groundY - ph * 0.65);
      ctx.lineTo(p1x + 18, groundY - ph * 0.62);
      ctx.lineWidth = 6;
      ctx.strokeStyle = "rgba(5,8,15,0.95)";
      ctx.stroke();
    };

    drawCouple(width * 0.5, height * 0.78);

    // ── Foreground elements (petals/leaves) ────────────────────────────────
    const rnd4 = rng(789);
    for (let i = 0; i < 30; i++) {
      const px = rnd4() * width;
      const py = height * 0.1 + rnd4() * height * 0.7;
      const ps = rnd4() * 8 + 3;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rnd4() * Math.PI * 2);
      ctx.fillStyle = `rgba(${prR},${prG},${prB},${rnd4() * 0.4 + 0.1})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, ps, ps * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // ── Bottom gradient for text readability ───────────────────────────────
    const textGrad = ctx.createLinearGradient(0, height * 0.55, 0, height);
    textGrad.addColorStop(0,   "rgba(0,0,0,0)");
    textGrad.addColorStop(0.4, `rgba(${bgR * 0.5 | 0},${bgG * 0.5 | 0},${bgB * 0.5 | 0},0.7)`);
    textGrad.addColorStop(1,   `rgba(${bgR * 0.2 | 0},${bgG * 0.2 | 0},${bgB * 0.2 | 0},0.95)`);
    ctx.fillStyle = textGrad;
    ctx.fillRect(0, height * 0.55, width, height * 0.45);

    // Export
    const url = canvas.toDataURL("image/jpeg", 0.92);
    setDataUrl(url);
    onGenerated?.(url);

  }, [spec, width, height]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {dataUrl && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${dataUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }} />
      )}
    </>
  );
}

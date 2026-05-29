"use client";
import { useEffect, useRef } from "react";
interface ParticleFieldProps { count?: number; }
export function ParticleField({ count = 30 }: ParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      const size = Math.random() < 0.3 ? 2 : 1;
      particle.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:#C9A84C;border-radius:50%;left:${Math.random()*100}%;animation:particleFloat ${8+Math.random()*12}s linear ${Math.random()*10}s infinite;opacity:0;`;
      container.appendChild(particle);
    }
  }, [count]);
  return <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" />;
}

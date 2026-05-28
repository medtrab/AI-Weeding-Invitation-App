"use client";
import { useEffect, useRef } from "react";

interface Props {
  html: string;
  className?: string;
}

/**
 * Safely renders AI-generated HTML in an isolated iframe.
 * The iframe has no access to parent window context.
 */
export function GeneratedInvitation({ html, className = "" }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !html) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(html);
    doc.close();

    // Auto-resize iframe to content height
    const resize = () => {
      try {
        const height = doc.documentElement.scrollHeight;
        if (height > 0) iframe.style.height = `${height}px`;
      } catch {}
    };

    // Resize after load and periodically (animations may change height)
    iframe.onload = resize;
    const timer = setTimeout(resize, 500);
    return () => clearTimeout(timer);
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      className={className}
      style={{ width: "100%", minHeight: "100vh", border: "none" }}
      title="Generated Invitation"
      sandbox="allow-scripts allow-forms allow-same-origin"
    />
  );
}

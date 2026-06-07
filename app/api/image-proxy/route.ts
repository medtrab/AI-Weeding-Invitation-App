import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// Server-side image proxy: fetches from Pollinations using Vercel's IP
// (different from the browser IP, avoids per-user rate limits)
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  // Only allow Pollinations URLs for security
  if (!url.startsWith("https://image.pollinations.ai/")) {
    return NextResponse.json({ error: "Only Pollinations URLs allowed" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 55000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept":     "image/jpeg,image/png,image/*",
        "Referer":    "https://pollinations.ai",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Upstream failed: ${res.status}`, detail: text.slice(0, 200) }, { status: 502 });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer      = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":  contentType,
        "Cache-Control": "public, max-age=86400, immutable", // Cache for 24h
        "Content-Length": String(buffer.byteLength),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 504 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "need ?slug=" });
  const inv = await db.invitation.findFirst({
    where: { slug },
    select: { generatedHtml: true, colorPalette: true, title: true, status: true }
  });
  if (!inv) return NextResponse.json({ error: "not found" });
  let parsed = null;
  try { parsed = JSON.parse(inv.generatedHtml || "{}"); } catch {}
  return NextResponse.json({
    status: inv.status,
    hasHtml: !!inv.generatedHtml,
    flags: { __cinematic: parsed?.__cinematic, __spec: parsed?.__spec },
    pollinationsUrl: parsed?.pollinationsUrl?.slice(0, 100),
    imagePrompt: parsed?.imagePrompt?.slice(0, 100),
    themeName: parsed?.spec?.theme?.name,
    sections: parsed?.spec?.sections?.map((s: {type:string; heading?:string}) => `${s.type}: ${s.heading?.slice(0,30)}`),
  });
}

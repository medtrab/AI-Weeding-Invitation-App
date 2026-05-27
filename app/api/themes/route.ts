import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventType = searchParams.get("eventType");
  const isPremium  = searchParams.get("isPremium");
  const tag        = searchParams.get("tag");

  const themes = await db.theme.findMany({
    where: {
      ...(eventType && { eventTypes: { has: eventType } }),
      ...(isPremium !== null && { isPremium: isPremium === "true" }),
      ...(tag && { tags: { has: tag } }),
    },
    orderBy: [{ isPremium: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(themes);
}

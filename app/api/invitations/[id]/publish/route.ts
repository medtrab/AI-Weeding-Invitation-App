import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

interface Params { params: Promise<{ id: string }> }

export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const existing = await db.invitation.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ detail: "Not found" }, { status: 404 });
  const updated = await db.invitation.update({ where: { id }, data: { status: "published", publishedAt: new Date() } });
  return NextResponse.json(updated);
}

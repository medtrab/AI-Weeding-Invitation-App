import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

interface Params { params: Promise<{ guestId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { guestId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const guest = await db.guest.update({ where: { id: guestId }, data: body });
  return NextResponse.json(guest);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { guestId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  await db.guest.delete({ where: { id: guestId } });
  return new NextResponse(null, { status: 204 });
}

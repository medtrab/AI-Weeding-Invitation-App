import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const inv = await db.invitation.findFirst({ where: { id, userId: user.id } });
  if (!inv) return NextResponse.json({ detail: "Not found" }, { status: 404 });

  const guests = await db.guest.findMany({
    where: { invitationId: id },
    include: { analytics: { orderBy: { createdAt: "desc" }, take: 10 } },
    orderBy: [{ isVip: "desc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(guests);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const inv = await db.invitation.findFirst({ where: { id, userId: user.id } });
  if (!inv) return NextResponse.json({ detail: "Not found" }, { status: 404 });

  const body = await req.json();
  const guest = await db.guest.create({
    data: {
      invitationId: id,
      name:         body.name,
      phone:        body.phone        || null,
      email:        body.email        || null,
      relationship: body.relationship || "other",
      isVip:        body.isVip        || false,
      tableNumber:  body.tableNumber  || null,
      notes:        body.notes        || null,
    },
  });
  return NextResponse.json(guest, { status: 201 });
}

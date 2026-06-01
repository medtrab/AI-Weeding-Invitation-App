import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

interface Params { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const inv = await db.invitation.findFirst({ where: { id, userId: user.id } });
  if (!inv) return NextResponse.json({ detail: "Not found" }, { status: 404 });

  const { guests } = await req.json() as {
    guests: Array<{ name: string; phone?: string; email?: string; relationship?: string; isVip?: boolean }>
  };

  const created = await db.guest.createMany({
    data: guests.map(g => ({
      invitationId: id,
      name:         g.name,
      phone:        g.phone        || null,
      email:        g.email        || null,
      relationship: (g.relationship as "family"|"friend"|"colleague"|"vip"|"other") || "other",
      isVip:        g.isVip        || false,
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({ created: created.count }, { status: 201 });
}

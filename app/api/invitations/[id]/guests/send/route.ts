import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

interface Params { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const inv = await db.invitation.findFirst({
    where: { id, userId: user.id },
    select: { slug: true, coupleName: true, title: true, venue: true, eventDate: true },
  });
  if (!inv) return NextResponse.json({ detail: "Not found" }, { status: 404 });

  const { guestIds } = await req.json() as { guestIds: string[] };

  const guests = await db.guest.findMany({
    where: { id: { in: guestIds }, invitationId: id },
    select: { id: true, name: true, phone: true, token: true },
  });

  // Mark as sent
  await db.guest.updateMany({
    where: { id: { in: guestIds } },
    data: { sendStatus: "sent", sentAt: new Date() },
  });

  // Return ONLY raw data — client builds all URLs using window.location.origin
  return NextResponse.json({
    invitationSlug: inv.slug,
    coupleName:     inv.coupleName || inv.title,
    venue:          inv.venue,
    eventDate:      inv.eventDate,
    guests: guests.map((g: { id: string; name: string; phone: string | null; token: string }) => ({
      id:    g.id,
      name:  g.name,
      phone: g.phone,
      token: g.token,
    })),
  });
}

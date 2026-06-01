import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";

interface Params { params: Promise<{ token: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const { token } = await params;
  const body = await req.json() as { event: string; metadata?: Record<string, unknown> };

  try {
    const guest = await db.guest.findUnique({ where: { token } });
    if (!guest) return NextResponse.json({ ok: false });

    await db.guestAnalytic.create({
      data: {
        guestId:     guest.id,
        invitationId: guest.invitationId,
        event:       body.event,
        metadata:    body.metadata || {},
        userAgent:   req.headers.get("user-agent") || undefined,
        ip:          req.headers.get("x-forwarded-for") || undefined,
      },
    });

    // Update viewed status on first open
    if (body.event === "opened") {
      await db.guest.updateMany({
        where: { token, sendStatus: "sent" },
        data: { },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}

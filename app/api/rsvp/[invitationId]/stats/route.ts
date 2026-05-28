import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ invitationId: string }> }) {
  const { invitationId } = await params;

  const [total, attending, declined, maybe, guestSum, invitation] = await Promise.all([
    db.rSVP.count({ where: { invitationId } }),
    db.rSVP.count({ where: { invitationId, status: "attending" } }),
    db.rSVP.count({ where: { invitationId, status: "declined" } }),
    db.rSVP.count({ where: { invitationId, status: "maybe" } }),
    db.rSVP.aggregate({ where: { invitationId, status: "attending" }, _sum: { guestCount: true } }),
    db.invitation.findUnique({ where: { id: invitationId }, select: { guestCount: true } }),
  ]);

  return NextResponse.json({
    total, attending, declined, maybe,
    totalGuests: guestSum._sum.guestCount ?? 0,
    responseRate: invitation?.guestCount ? Math.round((total / invitation.guestCount) * 100) : 0,
  });
}

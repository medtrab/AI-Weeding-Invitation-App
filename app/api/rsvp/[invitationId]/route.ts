import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { rsvpSubmitSchema } from "@/lib/validators/rsvp";

interface Params { params: Promise<{ invitationId: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { invitationId } = await params;
  const rsvps = await db.rSVP.findMany({
    where: { invitationId },
    orderBy: { respondedAt: "desc" },
  });
  return NextResponse.json(rsvps);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { invitationId } = await params;

  const invitation = await db.invitation.findFirst({
    where: { id: invitationId, status: "published" },
  });
  if (!invitation) {
    return NextResponse.json({ detail: "Invitation not found or not active" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = rsvpSubmitSchema.safeParse({ ...body, invitationId });
  if (!parsed.success) {
    return NextResponse.json({ detail: "Validation error", errors: parsed.error.flatten() }, { status: 422 });
  }

  let rsvp;
  if (parsed.data.guestEmail) {
    rsvp = await db.rSVP.upsert({
      where: { invitationId_guestEmail: { invitationId, guestEmail: parsed.data.guestEmail } },
      update: { ...parsed.data, respondedAt: new Date() },
      create: { ...parsed.data, respondedAt: new Date() },
    });
  } else {
    rsvp = await db.rSVP.create({ data: { ...parsed.data, respondedAt: new Date() } });
  }

  return NextResponse.json(rsvp, { status: 201 });
}

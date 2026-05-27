import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db/client";

interface Params { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const invitation = await db.invitation.findFirst({
    where: { id: params.id, userId: (session.user as { id: string }).id },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!invitation) return NextResponse.json({ detail: "Not found" }, { status: 404 });
  return NextResponse.json(invitation);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const existing = await db.invitation.findFirst({ where: { id: params.id, userId: (session.user as { id: string }).id } });
  if (!existing) return NextResponse.json({ detail: "Not found" }, { status: 404 });
  const { sections, ...fields } = body;
  const updated = await db.$transaction(async (tx) => {
    if (sections?.length) {
      for (const section of sections) {
        await tx.invitationSection.upsert({
          where: { id: section.id },
          update: { ...section },
          create: { ...section, invitationId: params.id },
        });
      }
    }
    return tx.invitation.update({ where: { id: params.id }, data: { ...fields, updatedAt: new Date() }, include: { sections: { orderBy: { order: "asc" } } } });
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const existing = await db.invitation.findFirst({ where: { id: params.id, userId: (session.user as { id: string }).id } });
  if (!existing) return NextResponse.json({ detail: "Not found" }, { status: 404 });
  await db.invitation.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}

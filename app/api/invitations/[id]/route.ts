import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import type { PrismaClient } from "@prisma/client";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const invitation = await db.invitation.findFirst({
    where: { id, userId: user.id },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!invitation) return NextResponse.json({ detail: "Not found" }, { status: 404 });
  return NextResponse.json(invitation);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const existing = await db.invitation.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ detail: "Not found" }, { status: 404 });
  const { sections, ...fields } = body;
  const updated = await db.$transaction(async (tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) => {
    if (sections?.length) {
      for (const section of sections) {
        await tx.invitationSection.upsert({
          where: { id: section.id },
          update: { ...section },
          create: { ...section, invitationId: id },
        });
      }
    }
    return tx.invitation.update({
      where: { id },
      data: { ...fields, updatedAt: new Date() },
      include: { sections: { orderBy: { order: "asc" } } },
    });
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const existing = await db.invitation.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ detail: "Not found" }, { status: 404 });
  await db.invitation.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

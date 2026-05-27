import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db/client";
import { generateSlug } from "@/lib/utils/slug";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const source = await db.invitation.findFirst({ where: { id: params.id, userId: (session.user as { id: string }).id }, include: { sections: true } });
  if (!source) return NextResponse.json({ detail: "Not found" }, { status: 404 });
  const { id: _id, slug: _slug, sections, createdAt: _ca, updatedAt: _ua, ...rest } = source;
  const newSlug = await generateSlug(`${rest.title} copy`);
  const duplicate = await db.invitation.create({
    data: { ...rest, slug: newSlug, status: "draft", title: `${rest.title} (Copy)`,
      sections: { create: sections.map(({ id: _sid, invitationId: _iid, createdAt: _sca, updatedAt: _sua, ...s }) => s) } },
    include: { sections: true },
  });
  return NextResponse.json(duplicate, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { generateSlug } from "@/lib/utils/slug";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const source = await db.invitation.findFirst({
    where: { id, userId: user.id },
    include: { sections: true },
  });
  if (!source) return NextResponse.json({ detail: "Not found" }, { status: 404 });

  const { id: _id, slug: _slug, sections, createdAt: _ca, updatedAt: _ua, ...rest } = source;
  const newSlug = await generateSlug(`${rest.title} copy`);

  const duplicate = await db.invitation.create({
    data: {
      ...rest,
      slug: newSlug,
      status: "draft",
      title: `${rest.title} (Copy)`,
      sections: {
        create: sections.map(({ id: _sid, invitationId: _iid, createdAt: _sca, updatedAt: _sua, ...s }: Record<string, unknown>) => s),
      },
    },
    include: { sections: true },
  });

  return NextResponse.json(duplicate, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db/client";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const invitation = await db.invitation.findFirst({
    where: { id, userId: (session.user as { id: string }).id },
  });
  if (!invitation) return NextResponse.json({ detail: "Not found" }, { status: 404 });

  const updated = await db.invitation.update({
    where: { id },
    data: { status: "published", publishedAt: new Date() },
  });
  return NextResponse.json(updated);
}

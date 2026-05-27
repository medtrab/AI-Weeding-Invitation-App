import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db/client";
import { generateSlug } from "@/lib/utils/slug";
import { invitationCreateSchema } from "@/lib/validators/invitation";
import { DEFAULT_COLOR_PALETTE, DEFAULT_SECTIONS } from "@/config/defaults";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const invitations = await db.invitation.findMany({
    where: { userId: (session.user as { id: string }).id },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(invitations);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = invitationCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ detail: "Validation error", errors: parsed.error.flatten() }, { status: 422 });
  const slug = await generateSlug(parsed.data.title);
  const invitation = await db.invitation.create({
    data: {
      ...parsed.data,
      userId: (session.user as { id: string }).id,
      slug,
      status: "draft",
      colorPalette: DEFAULT_COLOR_PALETTE,
      fontPrimary: "Cormorant Garamond",
      fontSecondary: "Jost",
      animationStyle: "elegant_fade",
      personalizedGreeting: true,
      showCountdown: true,
      sections: { create: DEFAULT_SECTIONS },
    },
  });
  return NextResponse.json(invitation, { status: 201 });
}

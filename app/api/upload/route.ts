import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const folder = (form.get("folder") as string) || "general";
  if (!file) return NextResponse.json({ detail: "No file provided" }, { status: 422 });
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ detail: "File too large (max 10 MB)" }, { status: 413 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ detail: "Invalid file type" }, { status: 415 });
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(base64, {
    folder: `invite/${userId}/${folder}`,
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return NextResponse.json({ url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const { publicId } = await req.json();
  if (!publicId) return NextResponse.json({ detail: "publicId required" }, { status: 422 });
  if (!publicId.startsWith(`invite/${userId}/`)) return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  await cloudinary.uploader.destroy(publicId);
  return new NextResponse(null, { status: 204 });
}

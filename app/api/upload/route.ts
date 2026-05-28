import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ detail: "No file provided" }, { status: 422 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ detail: "File too large (max 10 MB)" }, { status: 413 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ detail: "Invalid file type. Use JPG, PNG, or WebP." }, { status: 415 });
  }

  // ── Try Cloudinary first ──────────────────────────────────────────────────
  const cloudName   = process.env.CLOUDINARY_CLOUD_NAME;
  const cloudKey    = process.env.CLOUDINARY_API_KEY;
  const cloudSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && cloudKey && cloudSecret) {
    try {
      const { v2: cloudinary } = await import("cloudinary");
      cloudinary.config({ cloud_name: cloudName, api_key: cloudKey, api_secret: cloudSecret });

      const bytes  = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
      const folder = (form.get("folder") as string) || "general";
      const userId = (session.user as { id: string }).id;

      const result = await cloudinary.uploader.upload(base64, {
        folder: `invite/${userId}/${folder}`,
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });

      return NextResponse.json({
        url:      result.secure_url,
        publicId: result.public_id,
        width:    result.width,
        height:   result.height,
      });
    } catch (err) {
      console.error("Cloudinary upload failed, falling back to base64:", err);
      // Fall through to base64 fallback
    }
  }

  // ── Base64 fallback (no Cloudinary needed) ────────────────────────────────
  // Resize/compress large images before encoding
  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64Url = `data:${file.type};base64,${buffer.toString("base64")}`;

  return NextResponse.json({
    url:      base64Url,
    publicId: `local_${Date.now()}`,
    width:    0,
    height:   0,
  });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const { publicId } = await req.json();
  if (!publicId || publicId.startsWith("local_")) {
    return new NextResponse(null, { status: 204 });
  }

  const cloudName   = process.env.CLOUDINARY_CLOUD_NAME;
  const cloudKey    = process.env.CLOUDINARY_API_KEY;
  const cloudSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && cloudKey && cloudSecret) {
    const { v2: cloudinary } = await import("cloudinary");
    cloudinary.config({ cloud_name: cloudName, api_key: cloudKey, api_secret: cloudSecret });
    await cloudinary.uploader.destroy(publicId);
  }

  return new NextResponse(null, { status: 204 });
}

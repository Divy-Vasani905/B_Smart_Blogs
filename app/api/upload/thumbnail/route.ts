import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rate-limit";
import { apiSuccess, apiError } from "@/types/api.types";
import { getUserFromHeaders, handleApiError } from "@/lib/utils";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user) return NextResponse.json(apiError("Unauthorized"), { status: 401 });

    const limited = await rateLimit(req, "upload", user.userId);
    if (limited) return limited;

    const formData = await req.formData();
    const file = formData.get("thumbnail") as File | null;

    if (!file) return NextResponse.json(apiError("No thumbnail provided"), { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        apiError("Invalid file type. Only JPEG, PNG, and WebP are allowed."),
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        apiError("Thumbnail too large. Maximum size is 5MB."),
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer, "bsmart/thumbnails");

    return NextResponse.json(
      apiSuccess({
        url: result.secureUrl,
        publicId: result.publicId,
      }),
      { status: 201 }
    );
  } catch (err) {
    return handleApiError(err);
  }
}

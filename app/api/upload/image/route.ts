import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rate-limit";
import { validateImageMagicBytes } from "@/lib/validate-image";
import { apiSuccess, apiError } from "@/types/api.types";
import { getUserFromHeaders, handleApiError } from "@/lib/utils";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user) return NextResponse.json(apiError("Unauthorized"), { status: 401 });

    const limited = await rateLimit(req, "upload", user.userId);
    if (limited) return limited;

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) return NextResponse.json(apiError("No image provided"), { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        apiError("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."),
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        apiError("Image is too large. Maximum size is 5MB."),
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const magic = validateImageMagicBytes(buffer, file.type);
    if (!magic.valid) {
      return NextResponse.json(
        apiError("File content does not match its declared image type."),
        { status: 400 }
      );
    }

    const result = await uploadImage(buffer, "bsmart/blog-images");

    return NextResponse.json(
      apiSuccess({
        url: result.secureUrl,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
      }),
      { status: 201 }
    );
  } catch (err) {
    return handleApiError(err);
  }
}

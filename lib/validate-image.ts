export type DetectedImageType = "jpeg" | "png" | "webp" | "gif";

const MIME_TO_TYPE: Record<string, DetectedImageType> = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function startsWith(buffer: Buffer, bytes: number[], offset = 0): boolean {
  if (buffer.length < offset + bytes.length) return false;
  return bytes.every((byte, i) => buffer[offset + i] === byte);
}

/**
 * Detect image format from file magic bytes (not from Content-Type).
 */
export function detectImageType(buffer: Buffer): DetectedImageType | null {
  if (buffer.length < 12) return null;

  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return "jpeg";
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (startsWith(buffer, [0x47, 0x49, 0x46, 0x38])) return "gif";

  // RIFF....WEBP
  if (
    startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "webp";
  }

  return null;
}

/**
 * Ensure declared MIME type matches actual file content.
 */
export function validateImageMagicBytes(
  buffer: Buffer,
  declaredMime: string
): { valid: boolean; detected: DetectedImageType | null } {
  const expected = MIME_TO_TYPE[declaredMime];
  if (!expected) return { valid: false, detected: null };

  const detected = detectImageType(buffer);
  if (!detected) return { valid: false, detected: null };

  return { valid: detected === expected, detected };
}

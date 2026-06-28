/**
 * Parse JWT-style duration strings (e.g. "15m", "7d") to seconds for cookie maxAge.
 */
export function parseDurationToSeconds(duration: string): number {
  const match = duration.trim().match(/^(\d+)([smhd])$/i);
  if (!match) return 15 * 60;

  const value = parseInt(match[1], 10);
  switch (match[2].toLowerCase()) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 3600;
    case "d":
      return value * 86400;
    default:
      return 15 * 60;
  }
}

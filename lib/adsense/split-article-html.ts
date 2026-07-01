/**
 * Split article HTML roughly in half at a paragraph boundary for a mid-content ad slot.
 */
export function splitHtmlForMidAd(html: string): { before: string; after: string } {
  if (!html?.trim()) {
    return { before: "", after: "" };
  }

  const paragraphEnds: number[] = [];
  const regex = /<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    paragraphEnds.push(match.index + match[0].length);
  }

  if (paragraphEnds.length < 2) {
    return { before: html, after: "" };
  }

  const midIndex = Math.floor(paragraphEnds.length / 2);
  const splitAt = paragraphEnds[midIndex - 1] ?? paragraphEnds[0];

  return {
    before: html.slice(0, splitAt),
    after: html.slice(splitAt),
  };
}

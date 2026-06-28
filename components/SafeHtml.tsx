import { sanitizeHtml } from "@/lib/sanitize";

interface SafeHtmlProps {
  html: string;
  className?: string;
}

/**
 * Renders sanitized HTML. Safe for blog body content; preserves SEO-friendly markup.
 */
export function SafeHtml({ html, className }: SafeHtmlProps) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}

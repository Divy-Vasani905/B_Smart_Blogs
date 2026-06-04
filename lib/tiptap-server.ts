import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { sanitizeHtml } from "@/lib/sanitize";

// Tiptap extensions used for server-side HTML generation
const tiptapExtensions = [
  StarterKit,
  Image,
  Link,
  Table,
  TableRow,
  TableHeader,
  TableCell,
];

/**
 * Convert Tiptap JSON to sanitized HTML on the server.
 */
export function tiptapJsonToHtml(json: Record<string, unknown>): string {
  try {
    const html = generateHTML(json, tiptapExtensions);
    return sanitizeHtml(html);
  } catch {
    return "";
  }
}

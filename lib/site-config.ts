/**
 * Central site configuration for SEO, metadata, and branding.
 * Set NEXT_PUBLIC_SITE_URL in your .env.local for production.
 */
export const SITE_NAME = "B Smart Finance";
export const SITE_DEFAULT_TITLE = "B Smart Finance – Smart Investing & Money Tips";
export const SITE_DEFAULT_DESCRIPTION =
  "B Smart Finance empowers you with expert insights on investing, stock markets, crypto, and budgeting. Build wealth with clear, practical financial guides.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bsmartfinance.example.com";
export const SITE_IMAGE = `${SITE_URL}/og-finance.png`;
export const TWITTER_HANDLE = "@bsmartfinance";
export const SITE_KEYWORDS = [
  "finance blog",
  "investing",
  "stock market",
  "cryptocurrency",
  "budgeting",
  "savings tips",
  "personal finance",
  "wealth building",
  "financial literacy",
];

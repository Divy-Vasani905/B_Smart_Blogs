import Head from "next/head";
import {
  SITE_NAME,
  SITE_DEFAULT_TITLE,
  SITE_DEFAULT_DESCRIPTION,
  SITE_URL,
  SITE_IMAGE,
  TWITTER_HANDLE,
} from "@/lib/site-config";

export interface SeoProps {
  /** Page title (e.g. "About – BlogHub") */
  title?: string;
  /** Meta description (155–160 chars recommended) */
  description?: string;
  /** Canonical URL (defaults to current path on SITE_URL) */
  canonical?: string;
  /** OG/Twitter image URL (absolute) */
  image?: string;
  /** OG type: website | article */
  ogType?: "website" | "article";
  /** Article published time (ISO string) for og:article:published_time */
  publishedTime?: string;
  /** Article modified time (ISO string) for og:article:modified_time */
  modifiedTime?: string;
  /** Article author for og:article:author */
  author?: string;
  /** Article section/category for og:article:section */
  section?: string;
  /** Tags for og:article:tag */
  tags?: string[];
  /** Noindex this page */
  noindex?: boolean;
  /** JSON-LD structured data (object or array) */
  jsonLd?: object | object[];
}

export function Seo({
  title,
  description = SITE_DEFAULT_DESCRIPTION,
  canonical,
  image = SITE_IMAGE,
  ogType = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  noindex = false,
  jsonLd,
}: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_DEFAULT_TITLE;
  const canonicalUrl = canonical ? (canonical.startsWith("http") ? canonical : `${SITE_URL}${canonical}`) : undefined;
  const imageUrl = image?.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Head>
      {/* Primary meta */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl || SITE_URL} />
      <meta property="og:locale" content="en_US" />
      {ogType === "article" && (
        <>
          {publishedTime && <meta property="og:article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="og:article:modified_time" content={modifiedTime} />}
          {author && <meta property="og:article:author" content={author} />}
          {section && <meta property="og:article:section" content={section} />}
          {tags?.map((tag) => (
            <meta key={tag} property="og:article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd),
          }}
        />
      )}
    </Head>
  );
}

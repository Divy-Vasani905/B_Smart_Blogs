/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      `img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://*.cloudinary.com`,
      "media-src 'self'",
      "connect-src 'self' https://api.cloudinary.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig = {
  compress: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.cloudinary.com" },
    ],
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 24 hours instead of 1 hour
    minimumCacheTTL: 86400,
    // Match common display widths for blog card thumbnails
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Sizes used by small images / icons
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
        headers: securityHeaders,
      },
    ];
  },
  // Block admin path from being indexed in metadata
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;

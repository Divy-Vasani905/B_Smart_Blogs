import Link from "next/link";
import { TrendingUp, Twitter, Instagram, Youtube } from "lucide-react";
import { SITE_NAME } from "@/lib/site-config";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-muted/30" aria-label="Site footer">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-2 sm:pb-4">

        {/* ── Top Grid ── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg"
              aria-label={`${SITE_NAME} – Home`}
            >
              <TrendingUp className="h-5 w-5 text-emerald-600" aria-hidden />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {SITE_NAME}
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {/* ✏️ CHANGE THIS: Update your tagline */}
              Expert insights on investing, stock markets, and wealth building —
              empowering every Indian to make smarter financial decisions.
            </p>

            {/* Social Icons */}
            {/* <div className="flex items-center gap-3 mt-1">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-emerald-500 hover:text-emerald-600"
                aria-label="Twitter / X"
              >
                <Twitter className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-emerald-500 hover:text-emerald-600"
                aria-label="Instagram"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-emerald-500 hover:text-emerald-600"
                aria-label="YouTube"
              >
                <Youtube className="h-3.5 w-3.5" />
              </a>
            </div> */}
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-3" aria-label="Footer navigation">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Legal */}
          <nav className="flex flex-col gap-3" aria-label="Legal navigation">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Legal
            </p>
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Site Tools */}
          <nav className="flex flex-col gap-3" aria-label="Site tools">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Site
            </p>
            <Link
              href="/sitemap.xml"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sitemap
            </Link>
            <Link
              href="/robots.txt"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Robots.txt
            </Link>
          </nav>
        </div>

        {/* ── Divider ── */}
        <div className="mt-10 border-t border-border pt-2 sm:pt-4">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-xs text-muted-foreground">
              © {year} {SITE_NAME}. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground max-w-md">
              Disclaimer: Content on this site is for educational purposes only
              and does not constitute financial advice. Invest responsibly.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}


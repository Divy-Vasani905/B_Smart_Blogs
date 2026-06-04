import {
  TrendingUp,
  ShieldCheck,
  PieChart,
  Landmark,
  Target,
  Globe,
  BookOpen,
  BadgeCheck,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, SITE_KEYWORDS } from "@/lib/site-config";

const ABOUT_TITLE = "About Us – B Smart Finance";

const ABOUT_DESCRIPTION =
  "B Smart Finance helps readers make smarter financial decisions through trusted insights on investing, personal finance, budgeting, stock markets, cryptocurrency, and wealth building.";

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: { canonical: "/about" },

  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    url: `${SITE_URL}/about`,
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
  },
};

const features = [
  {
    icon: TrendingUp,
    title: "Market Insights",
    description:
      "Stay informed with simplified analysis of stock markets, investment opportunities, and economic trends.",
    gradient: "from-emerald-500 to-teal-600",
    bg: "from-emerald-50 to-teal-50",
  },

  {
    icon: ShieldCheck,
    title: "Trusted Financial Content",
    description:
      "Our articles are carefully researched to provide reliable and practical financial knowledge.",
    gradient: "from-blue-500 to-indigo-600",
    bg: "from-blue-50 to-indigo-50",
  },

  {
    icon: PieChart,
    title: "Smart Investing",
    description:
      "Learn investing strategies, portfolio diversification, and long-term wealth-building techniques.",
    gradient: "from-teal-500 to-cyan-500",
    bg: "from-teal-50 to-cyan-50",
  },

  {
    icon: Wallet,
    title: "Personal Finance",
    description:
      "Master budgeting, saving, debt management, and everyday money decisions with confidence.",
    gradient: "from-violet-500 to-purple-600",
    bg: "from-violet-50 to-purple-50",
  },

  {
    icon: Target,
    title: "Financial Goals",
    description:
      "Actionable financial guides designed to help you achieve your short-term and long-term goals.",
    gradient: "from-orange-500 to-amber-500",
    bg: "from-orange-50 to-amber-50",
  },

  {
    icon: Globe,
    title: "Global Financial Perspective",
    description:
      "Understand how global events, inflation, and economic policies affect your investments and finances.",
    gradient: "from-green-500 to-emerald-500",
    bg: "from-green-50 to-emerald-50",
  },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",

    name: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    url: `${SITE_URL}/about`,

    mainEntity: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      description: ABOUT_DESCRIPTION,

      foundingDate: "2024",

      knowsAbout: [
        "Personal Finance",
        "Investing",
        "Stock Market",
        "Cryptocurrency",
        "Wealth Management",
        "Financial Literacy",
      ],
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ───────────────── HERO ───────────────── */}
      <section
        className="overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-14 sm:py-18 md:py-24"
        aria-labelledby="about-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Trusted Financial Education
            </p>

            <h1
              id="about-heading"
              className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
            >
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                About B Smart Finance
              </span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              We help readers make smarter financial decisions through simple,
              practical, and trustworthy financial content. From investing and
              personal finance to budgeting and wealth creation, our mission is
              to make financial knowledge accessible to everyone.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium shadow-sm">
                Investing
              </div>

              <div className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium shadow-sm">
                Personal Finance
              </div>

              <div className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium shadow-sm">
                Stock Market
              </div>

              <div className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium shadow-sm">
                Wealth Building
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── MISSION ───────────────── */}
      <section
        className="border-y border-border bg-white py-14 sm:py-16"
        aria-labelledby="mission-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2
              id="mission-heading"
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Our Mission
            </h2>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Financial literacy should not be complicated. At B Smart Finance,
              we simplify complex financial topics into easy-to-understand
              guides that help everyday people improve their financial future.
            </p>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Whether you are starting your investing journey, learning to
              budget better, or planning long-term wealth creation, we aim to
              provide practical insights that are educational, transparent, and
              actionable.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────── FEATURES ───────────────── */}
      <section
        className="py-14 sm:py-18 md:py-20"
        aria-labelledby="values-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="values-heading"
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              What Makes Us Different
            </h2>

            <p className="mt-4 text-muted-foreground">
              We focus on trustworthy, practical, and easy-to-understand
              financial education for modern readers.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(
              ({ icon: Icon, title, description, gradient, bg }) => (
                <div
                  key={title}
                  className={`rounded-2xl border border-border bg-gradient-to-br ${bg} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div
                    className={`inline-flex rounded-xl bg-gradient-to-r ${gradient} p-3 text-white`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ───────────────── TRUST SECTION ───────────────── */}
      <section className="border-y border-border bg-slate-50 py-14 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Our Commitment
              </h2>

              <p className="mt-4 text-muted-foreground">
                We believe financial education should be transparent,
                trustworthy, and accessible to everyone.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <BadgeCheck className="h-8 w-8 text-emerald-600" />

                <h3 className="mt-4 text-lg font-semibold">
                  Research-Based Content
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Our articles are written using reliable financial sources,
                  market research, and practical financial knowledge.
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <BookOpen className="h-8 w-8 text-blue-600" />

                <h3 className="mt-4 text-lg font-semibold">
                  Beginner Friendly
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  We simplify complex financial concepts so readers at every
                  level can learn with confidence.
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <Landmark className="h-8 w-8 text-violet-600" />

                <h3 className="mt-4 text-lg font-semibold">
                  Long-Term Financial Growth
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Our focus is helping readers build sustainable wealth through
                  smart financial decisions and disciplined investing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── DISCLAIMER ───────────────── */}
      <section className="bg-white py-14 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
            <h2 className="w-full text-center mt-5 text-2xl font-bold text-red-700">
              Financial Disclaimer
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-red-800 sm:text-base">
              The information provided on <span className="font-semibold">B Smart Finance</span> is for educational and informational purposes only and should not be considered financial, investment, or legal advice.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-red-700 sm:text-base">
              Always conduct your own research and consult with a qualified financial professional before making any financial or investment decisions. Investments involve risks, including potential loss of capital.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────── CTA ───────────────── */}
      <nav
        className="border-t border-border bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 py-14 sm:py-16"
        aria-label="Related links"
      >
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to Start Reading?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Explore expert articles on personal finance, investing, budgeting,
            stock markets, and smart wealth-building strategies.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/blogs"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90"
            >
              Browse Blog Posts
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-7 py-3 text-sm font-semibold transition-colors hover:bg-accent"
            >
              Go Home
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
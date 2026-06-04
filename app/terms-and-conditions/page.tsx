import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

const TITLE = `Terms & Conditions | ${SITE_NAME}`;

const DESCRIPTION =
  "Read the official Terms & Conditions for B Smart Finance, including financial disclaimers, affiliate disclosures, AI content notices, advertising policies, and legal limitations.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/terms-and-conditions`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/terms-and-conditions`,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// UPDATE THESE
const EFFECTIVE_DATE = "1 April 2025";
const LAST_UPDATED = "23 May 2026";
const WEBSITE_URL = "https://yourdomain.com";
const CONTACT_EMAIL = "contact@yourdomain.com";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: (
      <>
        <p>
          By accessing or using this website, you agree to comply with these
          Terms & Conditions and all applicable laws and regulations.
        </p>

        <p className="mt-3">
          If you do not agree with any part of these Terms, you should stop
          using this website immediately.
        </p>
      </>
    ),
  },

  {
    title: "2. Website Purpose & Educational Content",
    content: (
      <>
        <p>
          {SITE_NAME} provides educational and informational content related to
          finance, investing, business, cryptocurrency, trading, loans, banking,
          insurance, taxation, and personal finance.
        </p>

        <p className="mt-3">
          All information is intended solely for general educational purposes
          and should not be interpreted as professional financial, investment,
          tax, legal, or accounting advice.
        </p>

        <p className="mt-3">
          Users are encouraged to independently verify information before making
          any financial decisions.
        </p>
      </>
    ),
  },

  {
    title: "3. No Financial Advisor Relationship",
    content: (
      <>
        <p>
          Use of this website does not establish any advisor-client,
          fiduciary, consultancy, or professional relationship between you and{" "}
          {SITE_NAME}.
        </p>

        <p className="mt-3">
          We do not provide personalized investment recommendations,
          portfolio management, tax consultation, or legal advice.
        </p>

        <p className="mt-3">
          Any reliance you place on information from this website is strictly
          at your own risk.
        </p>
      </>
    ),
  },

  {
    title: "4. Investment Risk Disclosure",
    content: (
      <>
        <p>
          Investing and trading in financial markets involve substantial risk,
          including the possible loss of principal capital.
        </p>

        <p className="mt-3">
          Financial markets are volatile and unpredictable. Past performance
          does not guarantee future results.
        </p>

        <p className="mt-3">
          This applies to all topics discussed on this website, including:
        </p>

        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Stocks & Equity Markets</li>
          <li>Cryptocurrency & Blockchain Assets</li>
          <li>Forex Trading</li>
          <li>Mutual Funds & SIPs</li>
          <li>Derivatives & Trading Strategies</li>
          <li>Loans & Credit Products</li>
          <li>Insurance & Financial Planning</li>
          <li>Passive Income & Online Earnings</li>
        </ul>

        <p className="mt-3">
          Users should consult qualified professionals before making financial
          decisions.
        </p>
      </>
    ),
  },

  {
    title: "5. Accuracy & Timeliness of Information",
    content: (
      <>
        <p>
          We strive to provide accurate, updated, and reliable information.
          However, we make no warranties regarding the completeness,
          reliability, accuracy, or timeliness of content published on this
          website.
        </p>

        <p className="mt-3">
          Financial laws, regulations, tax rules, market conditions, interest
          rates, and government policies may change without notice.
        </p>

        <p className="mt-3">
          Information available on this website may become outdated over time.
        </p>
      </>
    ),
  },

  {
    title: "6. SEBI & Regulatory Disclaimer",
    content: (
      <>
        <p>
          {SITE_NAME} is NOT registered with the Securities and Exchange Board
          of India (SEBI) as an investment advisor, portfolio manager, or
          research analyst.
        </p>

        <p className="mt-3">
          We do not provide regulated financial services or personalized
          investment recommendations.
        </p>

        <p className="mt-3">
          All content should be treated strictly as educational and informational
          material.
        </p>
      </>
    ),
  },

  {
    title: "7. AI-Assisted Content Disclosure",
    content: (
      <>
        <p>
          Some articles, summaries, research materials, or content published on
          this website may be created or assisted using artificial intelligence
          (AI) tools.
        </p>

        <p className="mt-3">
          While content is reviewed for quality and accuracy, AI-generated
          information may occasionally contain inaccuracies, omissions, or
          outdated details.
        </p>

        <p className="mt-3">
          Users should independently verify important information before relying
          on it.
        </p>
      </>
    ),
  },

  {
    title: "8. Affiliate Disclosure",
    content: (
      <>
        <p>
          This website may participate in affiliate marketing programs.
        </p>

        <p className="mt-3">
          We may earn commissions from qualifying purchases, product sign-ups,
          or services accessed through affiliate links at no additional cost to
          users.
        </p>

        <p className="mt-3">
          Our editorial opinions, reviews, and recommendations are intended to
          remain independent and are not directly influenced by advertisers or
          affiliate partnerships.
        </p>
      </>
    ),
  },

  {
    title: "9. Advertising & Sponsored Content",
    content: (
      <>
        <p>
          This website may display advertisements from third-party advertising
          platforms such as Google AdSense and other advertising networks.
        </p>

        <p className="mt-3">
          Sponsored content, paid promotions, or partnerships may occasionally
          appear on the website and will be disclosed where appropriate.
        </p>

        <p className="mt-3">
          We are not responsible for products, services, or claims made by
          advertisers or third parties.
        </p>
      </>
    ),
  },

  {
    title: "10. Third-Party Links",
    content: (
      <>
        <p>
          This website may contain links to external websites or third-party
          platforms for informational or affiliate purposes.
        </p>

        <p className="mt-3">
          We do not control or guarantee the accuracy, security, or reliability
          of external websites.
        </p>

        <p className="mt-3">
          Visiting third-party websites is done entirely at your own risk.
        </p>
      </>
    ),
  },

  {
    title: "11. Intellectual Property Rights",
    content: (
      <>
        <p>
          All original content on this website, including articles, branding,
          graphics, logos, designs, code, and visual assets, is protected by
          intellectual property and copyright laws.
        </p>

        <p className="mt-3">
          Unauthorized copying, reproduction, republication, or distribution of
          website content without written permission is prohibited.
        </p>
      </>
    ),
  },

  {
    title: "12. DMCA / Copyright Complaints",
    content: (
      <>
        <p>
          If you believe that any content on this website infringes your
          copyright or intellectual property rights, please contact us with
          sufficient details.
        </p>

        <p className="mt-3">
          Upon receiving valid complaints, we may investigate and remove
          infringing material where appropriate.
        </p>
      </>
    ),
  },

  {
    title: "13. User Conduct",
    content: (
      <>
        <p>
          Users agree not to misuse this website or engage in unlawful,
          harmful, or abusive activities.
        </p>

        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Attempting unauthorized access</li>
          <li>Spreading malware or harmful code</li>
          <li>Spamming or phishing</li>
          <li>Violating laws or regulations</li>
          <li>Using content for fraudulent purposes</li>
        </ul>
      </>
    ),
  },

  {
    title: "14. Termination Clause",
    content: (
      <>
        <p>
          We reserve the right to suspend, restrict, or permanently terminate
          access to this website at our sole discretion, without prior notice,
          for conduct that violates these Terms & Conditions.
        </p>
      </>
    ),
  },

  {
    title: "15. No Guarantees of Earnings or Results",
    content: (
      <>
        <p>
          We do not guarantee any financial outcome, trading success,
          investment returns, business growth, online earnings, or income
          results from using information available on this website.
        </p>

        <p className="mt-3">
          Results vary depending on individual circumstances, market conditions,
          skills, and risk tolerance.
        </p>
      </>
    ),
  },

  {
    title: "16. Limitation of Liability",
    content: (
      <>
        <p>
          To the fullest extent permitted by law, {SITE_NAME} and its owners
          shall not be liable for any direct, indirect, incidental,
          consequential, or financial losses arising from the use of this
          website.
        </p>

        <p className="mt-3">
          This includes trading losses, investment losses, business
          interruptions, or decisions made based on website content.
        </p>
      </>
    ),
  },

  {
    title: "17. Governing Law & Jurisdiction",
    content: (
      <>
        <p>
          These Terms & Conditions shall be governed and interpreted in
          accordance with the laws of India.
        </p>

        <p className="mt-3">
          Any disputes arising under these Terms shall be subject to the
          exclusive jurisdiction of the courts located in Surat, Gujarat,
          India.
        </p>
      </>
    ),
  },

  {
    title: "18. Changes to These Terms",
    content: (
      <>
        <p>
          We reserve the right to modify, update, or replace these Terms &
          Conditions at any time without prior notice.
        </p>

        <p className="mt-3">
          Continued use of the website after updates constitutes acceptance of
          the revised Terms.
        </p>
      </>
    ),
  },

  {
    title: "19. Contact Information",
    content: (
      <>
        <p>
          If you have any questions regarding these Terms & Conditions, you may
          contact us at:
        </p>

        <div className="mt-4 rounded-xl border bg-muted/40 p-4">
          <p>
            <strong>Website:</strong> {WEBSITE_URL}
          </p>

          <p className="mt-2">
            <strong>Email:</strong> {CONTACT_EMAIL}
          </p>
        </div>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="bg-background">

      {/* HERO */}
      <section className="border-b bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto max-w-5xl px-4 text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Legal Information
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Terms & Conditions
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base text-muted-foreground sm:text-lg">
            Please read these Terms & Conditions carefully before using{" "}
            <strong>{SITE_NAME}</strong>. By accessing this website, you agree
            to comply with these terms and all applicable laws.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>
              Effective Date: <strong>{EFFECTIVE_DATE}</strong>
            </span>

            <span>•</span>

            <span>
              Last Updated: <strong>{LAST_UPDATED}</strong>
            </span>
          </div>

        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto max-w-5xl px-4">

          {/* INTRO */}
          <div className="mb-10 rounded-2xl border bg-card p-6 shadow-sm">
            <p className="leading-7 text-muted-foreground">
              Welcome to <strong>{SITE_NAME}</strong>. This Terms & Conditions
              page explains the rules, legal disclaimers, limitations, and user
              responsibilities associated with using our financial content
              platform.
            </p>
          </div>

          {/* ACCORDION */}
          <div className="space-y-4">

            {sections.map((section, index) => (
              <details
                key={index}
                className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-semibold transition hover:bg-muted/50">

                  <span className="text-base sm:text-lg">
                    {section.title}
                  </span>

                  <span className="text-xl transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>

                </summary>

                <div className="border-t px-6 py-5 leading-7 text-muted-foreground">
                  {section.content}
                </div>
              </details>
            ))}

          </div>

          {/* FOOTER NOTE */}
          <div className="mt-12 rounded-2xl border bg-muted/40 p-6 text-sm leading-7 text-muted-foreground">
            <p>
              By continuing to use this website, you acknowledge that you have
              read, understood, and agreed to these Terms & Conditions.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
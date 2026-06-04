import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

const TITLE = `Affiliate Disclosure | ${SITE_NAME}`;
const DESCRIPTION =
  "B Smart Finance participates in affiliate programmes. Read our full affiliate disclosure to understand how we earn commissions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/affiliate-disclosure` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/affiliate-disclosure`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

// ✏️ CHANGE THIS: Set your actual effective date
const EFFECTIVE_DATE = "1 April 2025";
// ✏️ CHANGE THIS: Set your contact email
const CONTACT_EMAIL = "contact@yourdomain.com";

export default function AffiliateDisclosurePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">
              Transparency
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
                Affiliate Disclosure
              </span>
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Last updated: <strong>{EFFECTIVE_DATE}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate mx-auto max-w-3xl">

            {/* Highlight Box */}
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 not-prose mb-8">
              <p className="text-sm font-semibold text-red-800">Quick Summary</p>
              <p className="mt-1 text-sm text-red-700 leading-relaxed">
                Some links on <span className="font-semibold">{SITE_NAME}</span> are affiliate links. If you click on
                them and make a purchase, we may earn a small commission at no
                extra cost to you. We only recommend products we genuinely
                believe can help you.
              </p>
            </div>

            <h2 className="text-xl font-bold text-foreground">What Is an Affiliate Link?</h2>
            <p>
              An affiliate link is a special tracking URL that allows a merchant
              or service provider to identify that a visitor came from our Site.
              When you click an affiliate link and complete a purchase (or other
              qualifying action), we receive a small commission.
            </p>
            <p>
              These commissions help cover the costs of running this Site —
              including hosting, research, writing, and development — so we can
              continue to provide free, high-quality financial content.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">Our Commitment to Transparency</h2>
            <p>
              In accordance with the Federal Trade Commission (FTC) guidelines
              and similar regulations in other jurisdictions, we disclose our
              affiliate relationships clearly and honestly. Wherever an affiliate
              link or sponsored recommendation appears, we will indicate it with
              a notice such as &quot;This post contains affiliate links&quot; or a
              similar label.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">Our Editorial Independence</h2>
            <p>
              Our editorial content is <strong>never influenced by affiliate
                relationships</strong>. We do not:
            </p>
            <ul>
              <li>
                Write positive reviews in exchange for commissions or free
                products.
              </li>
              <li>
                Recommend products or services solely because they pay a higher
                commission.
              </li>
              <li>Suppress negative opinions to protect affiliate income.</li>
            </ul>
            <p>
              All recommendations are based on honest research and our genuine
              assessment of whether a product or service provides value to our
              readers. We prioritise your interests above our commercial ones.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">Affiliate Programmes We Participate In</h2>
            <p>
              {/* ✏️ CHANGE THIS: Add, remove or edit the list to match your actual affiliate programmes */}
              We currently participate in, or may participate in, affiliate
              programmes including but not limited to:
            </p>
            <ul>
              <li>
                <strong>Amazon Associates:</strong> We earn from qualifying
                purchases made through Amazon links.
              </li>
              <li>
                <strong>Financial product affiliates:</strong> We may partner
                with brokers, insurance providers, credit card issuers, or other
                financial platforms registered and regulated in India.
              </li>
              <li>
                <strong>Software &amp; Tools:</strong> Affiliate partnerships with
                portfolio trackers, budgeting apps, or other finance tools.
              </li>
            </ul>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">No Extra Cost to You</h2>
            <p>
              Clicking an affiliate link will never increase the price you pay.
              Commissions are paid by merchants from their marketing budgets.
              In many cases, affiliate links may even give you access to
              exclusive discounts or offers.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">Not Financial Advice</h2>
            <p>
              Affiliate product mentions are for informational purposes only and
              do not constitute financial, investment, or legal advice. Please
              conduct your own due diligence before purchasing any financial
              product or service. See our{" "}
              <a href="/disclaimer" className="text-teal-600 underline-offset-4 hover:underline">
                Disclaimer
              </a>{" "}
              for full details.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">Changes to This Disclosure</h2>
            <p>
              We may update this Affiliate Disclosure from time to time. Any
              changes will be posted on this page with an updated date. Continued
              use of the Site after changes are posted constitutes acceptance of
              the updated Disclosure.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">Questions?</h2>
            <p>
              If you have any questions about our affiliate relationships or how
              we earn money, please contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 underline-offset-4 hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

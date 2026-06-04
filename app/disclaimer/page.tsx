import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

const TITLE = `Disclaimer | ${SITE_NAME}`;
const DESCRIPTION =
  "Read the Disclaimer for B Smart Finance. The content on this site is for informational purposes only and does not constitute financial advice.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/disclaimer` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/disclaimer`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

// ✏️ CHANGE THIS: Set your actual effective date
const EFFECTIVE_DATE = "1 April 2025";
// ✏️ CHANGE THIS: Set your contact email
const CONTACT_EMAIL = "contact@yourdomain.com";

export default function DisclaimerPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-50 via-orange-50 to-red-50 py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
              Legal
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-500 bg-clip-text text-transparent">
                Disclaimer
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate mx-auto max-w-3xl">

            <p className="text-justify">
              The information provided on <strong>{SITE_NAME}</strong> is for
              <strong> general informational and educational purposes only</strong>.
              All content including articles, blog posts, guides, opinions, and
              any other material is shared in good faith. However, we make no
              representation or warranty of any kind, express or implied,
              regarding the accuracy, adequacy, validity, reliability,
              availability, or completeness of any information on this Site.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">Not Financial Advice</h2>
            <p className="text-justify">
              <strong>
                Nothing on this website constitutes financial, investment,
                trading, tax, legal, or any other professional advice.
              </strong>{" "}
              The content is intended solely to educate and inform. Any action
              you take upon the information found on this Site is strictly at
              your own risk. {SITE_NAME} and its authors will not be liable for
              any losses or damages in connection with the use of this Site.
            </p>
            <p className="text-justify">
              Always consult a qualified and licensed financial advisor, tax
              professional, or other expert before making any financial decisions
              or investments.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">Investment Risk Warning</h2>
            <p className="text-justify">
              Investing in stocks, mutual funds, bonds, cryptocurrencies, or any
              other financial instruments carries inherent risk, including the
              possible loss of the entire principal invested. Past performance is
              not indicative of future results. Market conditions, regulatory
              changes, and other factors can significantly affect investment
              values.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">No Guarantee of Results</h2>
            <p className="text-justify">
              {SITE_NAME} does not guarantee that you will achieve any particular
              financial result by following the information or strategies
              discussed on this Site. Individual results may vary based on
              personal circumstances, risk tolerance, and market conditions.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">Third-Party Content &amp; Links</h2>
            <p className="text-justify">
              This Site may contain links to external websites and references to
              third-party products, services, or opinions. We do not endorse or
              guarantee the accuracy of third-party content. We encourage you to
              independently verify any information before relying upon it.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">Affiliate Disclosure</h2>
            <p className="text-justify">
              Some articles and pages on this Site contain affiliate links. If
              you click on these links and make a purchase, we may earn a
              commission. This does not increase the cost to you. Please see our{" "}
              <a href="/affiliate-disclosure" className="text-amber-600 underline-offset-4 hover:underline">
                Affiliate Disclosure
              </a>{" "}
              for full details.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">Accuracy of Information</h2>
            <p className="text-justify">
              Financial regulations, tax laws, product features, and market data
              change frequently. While we strive to keep our content up to date,
              we cannot guarantee that all information is current. Please verify
              critical financial details from official or updated sources before
              acting on them.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">Limitation of Liability</h2>
            <p className="text-justify">
              Under no circumstances shall {SITE_NAME}, its owners, writers,
              contributors, or affiliates be liable for any direct, indirect,
              incidental, special, or consequential damages resulting from your
              use of (or inability to use) the content found on this Site.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">Changes to This Disclaimer</h2>
            <p className="text-justify">
              We reserve the right to update this Disclaimer at any time. Changes
              take effect immediately upon posting. Continued use of the Site
              after any changes constitutes your acceptance of the updated
              Disclaimer.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-xl font-bold text-foreground">Contact Us</h2>
            <p className="text-justify">
              If you have any questions about this Disclaimer, please contact
              us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-600 underline-offset-4 hover:underline">
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

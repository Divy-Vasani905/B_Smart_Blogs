import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

const TITLE = `Privacy Policy | ${SITE_NAME}`;
const DESCRIPTION =
  "Read the Privacy Policy of B Smart Finance to understand how we collect, use, store, and protect your personal information when you use our platform.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/privacy-policy`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "28 May 2025";
const LAST_UPDATED   = "28 May 2025";
const CONTACT_EMAIL  = "support@bsmartfinance.in";
const DMCA_EMAIL     = "dmca@bsmartfinance.in";

const sections = [
  {
    title: "1. Information We Collect",
    content: (
      <>
        <p className="font-medium text-foreground mb-2">a. Information You Provide Directly</p>
        <p>When you register, log in, or use the Platform, we collect:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <strong>Account Information:</strong> Your name, email address, and any profile
            details you choose to add (bio, profile picture).
          </li>
          <li>
            <strong>OTP Verification Data:</strong> When you sign up or log in, we send a
            one-time password (OTP) to your email. We temporarily store a cryptographically
            hashed version solely to verify your identity. OTPs expire within 10 minutes and
            are permanently deleted after use — never stored in plaintext.
          </li>
          <li>
            <strong>Blog Content:</strong> Articles, titles, excerpts, categories, tags,
            thumbnail images, and other content you submit through the write or edit dashboards.
          </li>
          <li>
            <strong>Uploaded Images:</strong> Images you upload are stored on Cloudinary. By
            uploading, you confirm you own the rights or have explicit permission to publish.
          </li>
          <li>
            <strong>Contact Form Messages:</strong> Your name, email address, and message
            content if you reach out via our contact page.
          </li>
        </ul>

        <p className="font-medium text-foreground mt-5 mb-2">b. Automatically Collected Information</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Log Data:</strong> IP address, browser type/version, OS, pages visited,
            time spent, referral URLs, and other diagnostic data.
          </li>
          <li>
            <strong>Authentication Cookies:</strong> HTTP-only, Secure cookies (
            <code>__bsf_acc</code> and <code>__bsf_adm</code>) to manage your login session.
            These are not accessible via JavaScript and are only transmitted over HTTPS.
          </li>
          <li>
            <strong>Analytics & Performance Data:</strong> Aggregated, non-identifiable data
            such as page view counts to improve the Platform.
          </li>
          <li>
            <strong>Advertising Cookies:</strong> Google AdSense may place cookies on your
            device. See Section 5 for full details.
          </li>
        </ul>
      </>
    ),
  },

  {
    title: "2. Browser Tracking Technologies",
    content: (
      <>
        <p>
          In addition to cookies, the Platform and our advertising partners may use the
          following browser-based tracking technologies:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <strong>Cookies:</strong> Small text files placed on your device to remember
            preferences, maintain login sessions, and enable advertising.
          </li>
          <li>
            <strong>Web Beacons / Pixel Tags:</strong> Tiny invisible images embedded in web
            pages or emails that signal when a page has been viewed or an email opened. Used
            by advertising partners (including Google AdSense) to measure campaign effectiveness.
          </li>
          <li>
            <strong>Local Storage & Session Storage:</strong> Browser-based storage to
            maintain temporary UI state (e.g., draft blog content while you write). Data
            stored here is not automatically transmitted to our servers.
          </li>
          <li>
            <strong>Browser Fingerprinting:</strong> Our security systems may analyse browser
            characteristics to detect and block automated or suspicious access. This is not
            linked to your name or email outside security investigations.
          </li>
          <li>
            <strong>Do Not Track (DNT):</strong> The Platform does not currently alter its
            behaviour in response to DNT signals, as no industry-wide standard for honouring
            them exists. You may opt out of personalised advertising separately via{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline-offset-4 hover:underline"
            >
              Google Ad Settings
            </a>
            .
          </li>
        </ul>
      </>
    ),
  },

  {
    title: "3. How We Use Your Information",
    content: (
      <>
        <p>We use the information we collect for the following purposes:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <strong>Authentication & Account Management:</strong> To verify your identity via
            OTP, maintain your login session, and manage your account.
          </li>
          <li>
            <strong>Platform Operation:</strong> To enable you to write, edit, publish, and
            manage blog posts; and to enable administrators to review, approve, or reject
            submitted content.
          </li>
          <li>
            <strong>Communication:</strong> To send OTP emails, account notifications, and
            responses to support enquiries.
          </li>
          <li>
            <strong>Security & Abuse Prevention:</strong> To detect and prevent fraudulent or
            abusive activity, including rate-limiting failed authentication attempts and
            blocking automated bots.
          </li>
          <li>
            <strong>Analytics & Improvement:</strong> To understand how users interact with
            the Platform and continuously improve the user experience.
          </li>
          <li>
            <strong>Advertising:</strong> To display relevant advertisements via Google
            AdSense and other ad networks.
          </li>
          <li>
            <strong>Legal Compliance:</strong> To comply with applicable laws, regulations,
            and legal processes.
          </li>
        </ul>
      </>
    ),
  },

  {
    title: "4. Cookies & Session Management",
    content: (
      <>
        <p>We use the following types of cookies:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <strong>Strictly Necessary Cookies:</strong> Authentication cookies (
            <code>__bsf_acc</code> and <code>__bsf_adm</code>) required for you to log in
            and access protected features. These are HTTP-only, Secure cookies that cannot be
            read by JavaScript and cannot be disabled without logging out.
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Used in aggregate to understand how visitors
            navigate the Platform. These do not identify you personally.
          </li>
          <li>
            <strong>Advertising Cookies:</strong> Google AdSense and its partners use cookies
            and web beacons to serve personalised advertisements based on your interests. You
            can opt out via{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline-offset-4 hover:underline"
            >
              Google Ad Settings
            </a>
            .
          </li>
        </ul>
        <p className="mt-3">
          You may configure your browser to block or delete non-essential cookies; however,
          blocking authentication cookies will prevent you from logging in or using
          authenticated features of the Platform.
        </p>
      </>
    ),
  },

  {
    title: "5. Google AdSense & Third-Party Advertising",
    content: (
      <>
        <p>
          <strong>{SITE_NAME}</strong> participates in the Google AdSense programme. By
          visiting the Platform, you acknowledge and agree that:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            Google and its advertising partners may use cookies, web beacons, and similar
            technologies to collect information about your visits to this and other websites
            to display relevant ads.
          </li>
          <li>
            We do not control what advertisements are shown and are{" "}
            <strong>not responsible</strong> for the content of any advertisement or for any
            products or services promoted therein. Any claims must be directed to the
            relevant advertiser.
          </li>
          <li>
            We may receive revenue when you view or interact with advertisements. This does
            not affect the editorial independence of content on the Platform.
          </li>
        </ul>
        <p className="mt-3">You may opt out of personalised advertising through:</p>
        <ul className="mt-2 list-disc space-y-2 pl-6">
          <li>
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline-offset-4 hover:underline"
            >
              Google Advertising Settings
            </a>
          </li>
          <li>
            <a
              href="https://www.networkadvertising.org/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline-offset-4 hover:underline"
            >
              Network Advertising Initiative (NAI) Opt-Out
            </a>
          </li>
          <li>
            <a
              href="https://optout.aboutads.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline-offset-4 hover:underline"
            >
              DAA / AboutAds.info Opt-Out
            </a>
          </li>
        </ul>
      </>
    ),
  },

  {
    title: "6. User-Generated Content & Content Moderation",
    content: (
      <>
        <p>
          {SITE_NAME} is a community-driven finance blog platform where registered users may
          submit articles for publication.{" "}
          <strong>You are solely responsible for all content you submit.</strong> By
          submitting content, you represent and warrant that:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            You own or have the necessary rights, licences, and permissions to submit the
            content.
          </li>
          <li>
            Your content does not violate any applicable law or the rights of any third
            party, including copyright, trademark, privacy, or defamation laws.
          </li>
          <li>
            Your content is not false, misleading, defamatory, obscene, harassing, or
            otherwise objectionable.
          </li>
          <li>
            Your content does not impersonate any person or misrepresent your affiliation
            with any entity.
          </li>
        </ul>
        <p className="mt-3">
          All submitted articles are subject to editorial review before publication. We
          reserve the right to approve, reject, request changes to, or remove any submitted
          content at our sole discretion, at any time and without providing a reason.
        </p>
        <p className="mt-3">
          By submitting content, you grant <strong>{SITE_NAME}</strong> a non-exclusive,
          worldwide, royalty-free, sublicensable licence to display, reproduce, distribute,
          and promote that content on the Platform and associated marketing channels.
        </p>
      </>
    ),
  },

  {
    title: "7. AI & Generated Content Disclaimer",
    content: (
      <>
        <p>
          Some content on the Platform — including blog posts submitted by users or produced
          by our team — may be wholly or partially generated, assisted, or enhanced using
          artificial intelligence (AI) tools.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <strong>No Endorsement of Accuracy:</strong> AI-generated content may contain
            factual errors, outdated information, hallucinated data, or inaccurate financial
            figures. We do not guarantee the accuracy, completeness, or reliability of any
            AI-assisted content.
          </li>
          <li>
            <strong>Human Review:</strong> Our editorial team reviews submitted content before
            publication; however, this does not constitute a guarantee of accuracy or
            professional verification.
          </li>
          <li>
            <strong>Not Professional Advice:</strong> AI-generated content does not constitute
            financial, investment, legal, or any other form of professional advice. See
            Section 8 for our full financial disclaimer.
          </li>
          <li>
            <strong>Copyright & Attribution:</strong> Content generated using AI tools may
            not be eligible for copyright protection in all jurisdictions. By submitting
            AI-generated content, you acknowledge this and confirm you have the right to
            publish it under the terms of any AI tool used.
          </li>
        </ul>
        <p className="mt-3">
          <strong>
            {SITE_NAME} accepts no liability for any loss, harm, or damage arising from
            reliance on AI-generated or AI-assisted content published on the Platform.
          </strong>
        </p>
      </>
    ),
  },

  {
    title: "8. Financial Content Disclaimer & No Financial Advisor Relationship",
    content: (
      <>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 mb-4">
          <p className="text-sm font-bold text-amber-900 mb-1">⚠ Important — Please Read Carefully</p>
          <p className="text-sm text-amber-800">
            The content on {SITE_NAME} is for general informational and educational purposes
            only. It is <strong>not</strong> financial advice. Always consult a qualified,
            licensed financial adviser before making any investment or financial decision.
          </p>
        </div>

        <p>
          <strong>No Financial Advisor Relationship:</strong> Nothing on this Platform
          creates, or should be construed to create, a financial adviser–client, investment
          adviser–client, or broker–dealer relationship between {SITE_NAME} (or any of its
          contributors) and you.
        </p>

        <p className="mt-3">
          <strong>Informational Purpose Only:</strong> All articles, analyses, market
          commentary, investment strategies, stock or crypto mentions, and financial data —
          whether written by our team, registered users, or AI-assisted — are provided
          solely for educational purposes. They do not constitute:
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-6">
          <li>An offer, solicitation, or recommendation to buy or sell any security or investment product.</li>
          <li>Personalised investment advice tailored to your individual financial situation.</li>
          <li>Tax advice or legal advice of any kind.</li>
        </ul>

        <p className="mt-3">
          <strong>
            {SITE_NAME} and its administrators, editors, contributors, and affiliates shall
            not be liable for any financial loss or damage — including direct, indirect,
            incidental, special, exemplary, or consequential loss — arising from the use of,
            or reliance on, any content published on the Platform.
          </strong>
        </p>
      </>
    ),
  },

  {
    title: "9. Third-Party Services & Links",
    content: (
      <>
        <p>The Platform integrates with and may link to third-party services, including:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <strong>Cloudinary</strong> — image hosting and optimisation. Images you upload
            are subject to{" "}
            <a
              href="https://cloudinary.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline-offset-4 hover:underline"
            >
              Cloudinary&apos;s Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong>MongoDB Atlas</strong> — secure cloud database for user accounts, OTP
            records, and blog content.
          </li>
          <li>
            <strong>Email Service Provider (Nodemailer / SMTP)</strong> — for sending OTP
            emails and account notifications.
          </li>
          <li>
            <strong>Google AdSense</strong> — advertisement delivery (see Section 5).
          </li>
        </ul>
        <p className="mt-3">
          Blog posts may contain links to external websites. We have no control over and
          accept no responsibility for the content, privacy policies, or practices of any
          third-party website. We strongly encourage you to read the privacy policy of every
          site you visit.
        </p>
      </>
    ),
  },

  {
    title: "10. Data Sharing & Disclosure",
    content: (
      <>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may
          share your information only in the following limited circumstances:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <strong>Service Providers:</strong> With trusted third-party service providers
            (e.g., Cloudinary, email services, database providers) under strict
            confidentiality obligations and only to the extent necessary to operate the
            Platform.
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by applicable law, court
            order, or government authority, or to protect the rights, property, or safety of
            {" "}{SITE_NAME}, our users, or the public.
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with a merger, acquisition, or
            sale of assets. You will be notified via a prominent notice on the Platform
            before any such transfer.
          </li>
          <li>
            <strong>Enforcement:</strong> To enforce our Terms & Conditions, investigate
            potential violations, or address copyright complaints submitted under Section 12.
          </li>
        </ul>
      </>
    ),
  },

  {
    title: "11. Data Retention",
    content: (
      <>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>User accounts:</strong> Retained for as long as your account remains
            active or as needed to provide our services.
          </li>
          <li>
            <strong>OTP records:</strong> Deleted automatically upon use or expiry (within
            10 minutes). Never stored in plaintext.
          </li>
          <li>
            <strong>Blog posts:</strong> Retained indefinitely unless you request deletion
            or your account is terminated.
          </li>
          <li>
            <strong>Contact-form messages:</strong> Retained for up to 12 months, then
            securely deleted.
          </li>
          <li>
            <strong>Server log data:</strong> Retained for up to 90 days for security and
            diagnostic purposes, then automatically purged.
          </li>
          <li>
            <strong>Uploaded images:</strong> Stored on Cloudinary and retained as long as
            your account is active or until you delete the associated blog post.
          </li>
        </ul>
      </>
    ),
  },

  {
    title: "12. Copyright Complaint Policy (DMCA)",
    content: (
      <>
        <p>
          {SITE_NAME} respects the intellectual property rights of others and expects users
          to do the same. If you believe any content on the Platform infringes your
          copyright, please submit a written notice to:
        </p>
        <div className="mt-4 rounded-xl border bg-muted/40 p-4">
          <p>
            <strong>DMCA / Copyright Email:</strong>{" "}
            <a
              href={`mailto:${DMCA_EMAIL}`}
              className="text-indigo-600 underline-offset-4 hover:underline"
            >
              {DMCA_EMAIL}
            </a>
          </p>
        </div>
        <p className="mt-4">Your notice must include:</p>
        <ol className="mt-2 list-decimal space-y-2 pl-6">
          <li>A physical or electronic signature of the copyright owner or authorised representative.</li>
          <li>Identification of the copyrighted work claimed to be infringed.</li>
          <li>The URL of the infringing material on the Platform.</li>
          <li>Your contact information (name, address, phone number, email).</li>
          <li>
            A statement of good-faith belief that the use is not authorised by the copyright
            owner, its agent, or applicable law.
          </li>
          <li>
            A statement, made under penalty of perjury, that the information is accurate and
            you are the copyright owner or authorised to act on their behalf.
          </li>
        </ol>
        <p className="mt-3">
          Upon receiving a valid complaint, we will investigate and, where appropriate,
          remove or disable access to the infringing content. Repeat infringers will have
          their accounts terminated.
        </p>
        <p className="mt-3">
          <strong>Counter-Notification:</strong> If you believe your content was removed in
          error, you may submit a counter-notification to the same email address above.
        </p>
      </>
    ),
  },

  {
    title: "13. Security",
    content: (
      <>
        <p>
          We implement industry-standard technical and organisational security measures,
          including:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <strong>Encrypted Authentication Tokens:</strong> All JWTs are signed using
            strong cryptographic algorithms (JOSE) and transmitted via HTTPS-only, HTTP-only,
            Secure cookies that cannot be accessed by client-side JavaScript.
          </li>
          <li>
            <strong>OTP Security:</strong> OTPs are never stored in plaintext. A
            cryptographic hash is stored temporarily and invalidated immediately upon use or
            expiry, preventing replay attacks.
          </li>
          <li>
            <strong>Rate Limiting & Brute-Force Protection:</strong> All authentication
            endpoints are protected by server-side rate limiting. Excessive failed attempts
            trigger temporary IP-based blocks.
          </li>
          <li>
            <strong>Content Sanitisation (XSS Prevention):</strong> All user-generated HTML
            content is sanitised using DOMPurify before being stored and rendered, preventing
            cross-site scripting (XSS) attacks.
          </li>
          <li>
            <strong>Role-Based Access Control (RBAC):</strong> Strict RBAC is enforced via
            middleware on every protected route. Admin routes are inaccessible to non-admin
            users.
          </li>
          <li>
            <strong>Secure Image Storage:</strong> Images are stored on Cloudinary, a
            SOC 2-compliant cloud service.
          </li>
          <li>
            <strong>HTTPS Enforcement:</strong> All data in transit is encrypted using TLS.
          </li>
        </ul>
        <p className="mt-3">
          <strong>
            Despite these measures, no method of data transmission or electronic storage is
            100% secure. We cannot guarantee absolute security. By using the Platform, you
            acknowledge and accept this inherent risk.
          </strong>
        </p>
      </>
    ),
  },

  {
    title: "14. Children's Privacy",
    content: (
      <>
        <p>
          The Platform is not directed to individuals under the age of 18. We do not
          knowingly collect personal information from minors. If we become aware that a minor
          has registered without parental consent, we will immediately delete that account
          and all associated data.
        </p>
        <p className="mt-3">
          If you believe a minor has provided us with personal information, please contact us
          at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-indigo-600 underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </>
    ),
  },

  {
    title: "15. Your Rights",
    content: (
      <>
        <p>
          Depending on your jurisdiction (including the GDPR, India&apos;s DPDP Act, and
          California CCPA), you may have the following rights:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <strong>Access:</strong> Request a copy of the personal data we hold about you.
          </li>
          <li>
            <strong>Correction:</strong> Request correction of inaccurate or incomplete
            information.
          </li>
          <li>
            <strong>Deletion (&quot;Right to Erasure&quot;):</strong> Request deletion of
            your account and associated personal data, subject to legal or operational
            retention requirements.
          </li>
          <li>
            <strong>Objection / Restriction:</strong> Object to or request restriction of
            certain processing activities.
          </li>
          <li>
            <strong>Data Portability:</strong> Request a copy of your data in a structured,
            machine-readable format where technically feasible.
          </li>
          <li>
            <strong>Withdraw Consent:</strong> Where processing is based on consent, you
            may withdraw it at any time without affecting the lawfulness of prior processing.
          </li>
          <li>
            <strong>Opt Out of Advertising:</strong> Opt out of personalised advertising at
            any time via the links provided in Section 5.
          </li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, contact us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-indigo-600 underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          . We will respond within 30 days. We may need to verify your identity before
          processing certain requests.
        </p>
      </>
    ),
  },

  {
    title: "16. Account Termination",
    content: (
      <>
        <p>
          We reserve the right to suspend or terminate your account at any time, with or
          without notice, if we determine in our sole discretion that:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>You have violated this Privacy Policy or our Terms & Conditions.</li>
          <li>
            You have submitted content that is false, plagiarised, defamatory, AI-generated
            without disclosure, or otherwise harmful.
          </li>
          <li>You have filed a fraudulent or abusive copyright complaint.</li>
          <li>
            Your account poses a security, legal, or reputational risk to the Platform or
            its users.
          </li>
        </ul>
        <p className="mt-3">
          Upon termination, your access will be immediately revoked. We may retain your data
          as required for legal, security, or operational purposes, or to resolve outstanding
          disputes.
        </p>
      </>
    ),
  },

  {
    title: "17. Changes to This Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our
          practices or for operational, legal, or regulatory reasons. We will post the
          updated policy on this page with a revised &quot;Last Updated&quot; date.
        </p>
        <p className="mt-3">
          For material changes, we will endeavour to notify registered users via email or a
          prominent notice on the Platform.{" "}
          <strong>
            Your continued use of the Platform after any changes constitutes your acceptance
            of the updated policy.
          </strong>{" "}
          If you do not agree with any update, you must stop using the Platform and may
          request account deletion as described in Section 15.
        </p>
      </>
    ),
  },

  {
    title: "18. Contact Us",
    content: (
      <>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or
          our data practices, please reach out to us:
        </p>
        <div className="mt-4 rounded-xl border bg-muted/40 p-4 space-y-2">
          <p>
            <strong>General / Data Requests:</strong>{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-indigo-600 underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p>
            <strong>Copyright / DMCA Complaints:</strong>{" "}
            <a
              href={`mailto:${DMCA_EMAIL}`}
              className="text-indigo-600 underline-offset-4 hover:underline"
            >
              {DMCA_EMAIL}
            </a>
          </p>
          <p>
            <strong>Contact Form:</strong>{" "}
            <a
              href={`${SITE_URL}/contact`}
              className="text-indigo-600 underline-offset-4 hover:underline"
            >
              {SITE_URL}/contact
            </a>
          </p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-background">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="border-b bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto max-w-5xl px-4 text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Legal Information
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base text-muted-foreground sm:text-lg">
            Please read this Privacy Policy carefully before using{" "}
            <strong>{SITE_NAME}</strong>. By accessing this Platform, you agree
            to the collection and use of your information as described herein.
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

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto max-w-5xl px-4">

          {/* INTRO */}
          <div className="mb-10 rounded-2xl border bg-card p-6 shadow-sm">
            <p className="leading-7 text-muted-foreground">
              Welcome to <strong>{SITE_NAME}</strong>. This Privacy Policy
              describes what personal information we collect, how we use and
              store it, with whom we share it, and the rights you have regarding
              your data. By creating an account or using the Platform in any way,
              you confirm that you are at least 18 years old and have read,
              understood, and agree to this Privacy Policy.{" "}
              <strong>If you do not agree, please do not use the Platform.</strong>
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
              By continuing to use this Platform, you acknowledge that you have
              read, understood, and agreed to this Privacy Policy. For questions
              or data requests, contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-indigo-600 underline-offset-4 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}

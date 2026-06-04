import type { Metadata } from "next";
import { Mail, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

const TITLE = `Contact Us | ${SITE_NAME}`;
const DESCRIPTION =
  "Have a question, feedback, or collaboration idea? Get in touch with the B Smart Finance team. We typically respond within 1–2 business days.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              Get In Touch
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Contact Us
              </span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              We'd love to hear from you — whether it's a question, feedback, or
              a collaboration request.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">

            {/* Left – Info Cards */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold sm:text-2xl">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                {/* ✏️ CHANGE THIS: Replace with your actual contact details */}
                You can reach us through any of the channels below. For blog
                corrections, content pitches, or advertising enquiries, email
                is the fastest way to get a response.
              </p>

              {/* Email Card */}
              <div className="flex items-start gap-4 rounded-xl border border-border bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Email Us</p>
                  {/* ✏️ CHANGE THIS: Replace with your real email address */}
                  <a
                    href="mailto:contact@yourdomain.com"
                    className="mt-1 text-sm text-emerald-700 underline-offset-4 hover:underline"
                  >
                    contact@yourdomain.com
                  </a>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We respond within 1–2 business days.
                  </p>
                </div>
              </div>

              {/* Location Card */}
              <div className="flex items-start gap-4 rounded-xl border border-border bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Location</p>
                  {/* ✏️ CHANGE THIS: Replace with your city/country */}
                  <p className="mt-1 text-sm text-muted-foreground">
                    India
                  </p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="flex items-start gap-4 rounded-xl border border-border bg-gradient-to-br from-violet-50 to-purple-50 p-5 shadow-sm">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Response Hours</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Monday – Friday, 10 AM – 6 PM IST
                  </p>
                </div>
              </div>

              {/* Topics Card */}
              <div className="flex items-start gap-4 rounded-xl border border-border bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">What Can You Write To Us About?</p>
                  <ul className="mt-2 list-disc pl-4 text-sm text-muted-foreground space-y-1">
                    <li>Content corrections or suggestions</li>
                    <li>Guest post / collaboration requests</li>
                    <li>Advertising &amp; sponsorship enquiries</li>
                    <li>General feedback about the site</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right – Contact Form (visual only – wire up with a form service) */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold sm:text-2xl">Send Us a Message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {/* ✏️ CHANGE THIS: You can wire this form to a service like Formspree, EmailJS, or your own API */}
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              {/* NOTE: This is a static UI form. Hook up action="" to a form backend of your choice */}
              <form className="mt-6 flex flex-col gap-5" action="#" method="POST">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      placeholder="Your first name"
                      className="h-10 rounded-md border border-border bg-secondary/40 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Your last name"
                      className="h-10 rounded-md border border-border bg-secondary/40 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="h-10 rounded-md border border-border bg-secondary/40 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="h-10 rounded-md border border-border bg-secondary/40 px-3 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="" disabled selected>
                      Select a subject
                    </option>
                    <option value="feedback">General Feedback</option>
                    <option value="correction">Content Correction</option>
                    <option value="guest">Guest Post / Collaboration</option>
                    <option value="advertising">Advertising / Sponsorship</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Tell us what's on your mind..."
                    className="resize-y rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow transition-all hover:from-emerald-700 hover:to-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Disclaimer Banner ── */}
      <section className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-3xl text-center text-xs text-muted-foreground">
            {/* ✏️ CHANGE THIS: Update the email address below */}
            For urgent matters, email us directly at{" "}
            <a href="mailto:contact@yourdomain.com" className="underline underline-offset-2">
              contact@yourdomain.com
            </a>
            . Please do not send personal financial data over email.
          </p>
        </div>
      </section>
    </>
  );
}

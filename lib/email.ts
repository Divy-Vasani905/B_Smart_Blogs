import nodemailer from "nodemailer";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT || "2525"),
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  const fromName = SITE_NAME;
  const fromEmail = process.env.SMTP_FROM || "no-reply@bsmartfinance.com";

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Error sending email via Nodemailer:", error);
    return false;
  }
}

interface OtpEmailTemplateParams {
  name: string;
  otpCode: string;
  expiryMinutes: number;
  purpose: "signup" | "login";
}

export function getOtpEmailTemplate({
  name,
  otpCode,
  expiryMinutes,
  purpose,
}: OtpEmailTemplateParams): string {
  const actionText = purpose === "signup" ? "complete your signup" : "log in to your account";
  const actionTitle = purpose === "signup" ? "Verify Your Signup" : "Verify Your Login";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${actionTitle}</title>
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #0f172a;
            color: #f8fafc;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #1e293b;
            border: 1px solid #334155;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
          }
          .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            padding: 32px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.025em;
          }
          .logo-text {
            color: #ffffff;
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            opacity: 0.85;
            margin-bottom: 8px;
          }
          .content {
            padding: 40px 32px;
          }
          .greeting {
            font-size: 16px;
            color: #e2e8f0;
            margin-top: 0;
            margin-bottom: 16px;
          }
          .instruction {
            font-size: 15px;
            line-height: 1.6;
            color: #94a3b8;
            margin-bottom: 32px;
          }
          .otp-container {
            background-color: #0f172a;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin-bottom: 32px;
          }
          .otp-code {
            font-family: 'Courier New', Courier, monospace;
            font-size: 36px;
            font-weight: 700;
            letter-spacing: 0.25em;
            color: #38bdf8;
            margin: 0;
          }
          .expiry-warning {
            font-size: 13px;
            color: #f43f5e;
            font-weight: 500;
            margin-top: 12px;
            margin-bottom: 0;
          }
          .security-note {
            background-color: rgba(51, 65, 85, 0.3);
            border-left: 4px solid #64748b;
            padding: 16px;
            border-radius: 0 8px 8px 0;
            font-size: 13px;
            line-height: 1.5;
            color: #94a3b8;
            margin-bottom: 32px;
          }
          .footer {
            padding: 32px;
            background-color: #0f172a;
            border-top: 1px solid #334155;
            text-align: center;
            font-size: 12px;
            color: #64748b;
          }
          .footer a {
            color: #818cf8;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-text">${SITE_NAME}</div>
            <h1>${actionTitle}</h1>
          </div>
          <div class="content">
            <p class="greeting">Hello ${name},</p>
            <p class="instruction">
              We received a request to ${actionText}. Use the 6-digit verification code below to proceed.
            </p>
            <div class="otp-container">
              <div class="otp-code">${otpCode}</div>
              <p class="expiry-warning">This code will expire in ${expiryMinutes} minutes.</p>
            </div>
            <div class="security-note">
              <strong>Security Warning:</strong> Never share this code with anyone. B Smart Finance support will never ask for this code. If you did not make this request, you can safely ignore this email.
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
            <p><a href="${SITE_URL}">Visit our website</a> | <a href="${SITE_URL}/privacy-policy">Privacy Policy</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

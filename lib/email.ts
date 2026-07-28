import { Resend } from "resend";

// Free-tier Resend: sending "from" the shared onboarding@resend.dev address only
// works when "to" matches the email the Resend account was signed up with, until
// a custom domain is verified. Once the client has a domain, switch RESEND_FROM
// to something like "High Life Express <notifications@highlifeexpress.ca>".
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendNotificationEmail(subject: string, html: string) {
  const to = process.env.NOTIFY_EMAIL;
  if (!resend || !to) {
    console.warn("Email notification skipped — RESEND_API_KEY or NOTIFY_EMAIL not set.");
    return;
  }
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || "High Life Express <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send notification email:", err);
  }
}

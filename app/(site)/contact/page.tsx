import { PromoBar } from "@/components/PromoBar";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/queries";
import { parsePromoMessages } from "@/lib/marketing";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PromoBar messages={parsePromoMessages(settings.promo_messages)} />
      <SiteNav />

      <div className="page-hero">
        <h1>Get In Touch</h1>
        <p>Questions about a strain or a reservation? We&apos;d love to hear from you.</p>
        <p style={{ fontWeight: 700 }}>Order online or text in your order!</p>
      </div>

      <div className="page-content">
        <div className="info-grid">
          <div className="info-card">
            <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            <strong>Phone</strong>
            <span>{settings.contact_phone ?? "Coming soon"}</span>
          </div>
          <div className="info-card">
            <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            <strong>Email</strong>
            <span>{settings.contact_email ?? "Coming soon"}</span>
          </div>
          <div className="info-card">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            <strong>Hours</strong>
            <span>{settings.hours ?? "Coming soon"}</span>
          </div>
          <div className="info-card">
            <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <strong>Service Area</strong>
            <span>{settings.service_area ?? "Ontario, Canada"}</span>
          </div>
        </div>

        <h2>Send Us a Message</h2>
        <ContactForm />
      </div>

      <Footer />
    </>
  );
}

import { PromoBar } from "@/components/PromoBar";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { getSiteSettings } from "@/lib/queries";
import { parsePromoMessages } from "@/lib/marketing";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PromoBar messages={parsePromoMessages(settings.promo_messages)} />
      <SiteNav />

      <div className="page-hero">
        <h1>About High Life Express</h1>
        <p>Your licensed Ontario source for premium, hand-selected cannabis.</p>
      </div>

      <div className="page-content">
        <h2>Our Story</h2>
        <p>
          High Life Express is a licensed cannabis dispensary proudly serving Ontario. We&apos;re
          passionate about connecting our customers with premium, hand-selected flower and products —
          sourced with quality and consistency in mind. Every strain in our catalog is chosen for its
          potency, flavor, and effect, so you always know what you&apos;re getting.
        </p>

        <h2>Why Choose Us</h2>
        <div className="info-grid">
          <div className="info-card">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>
            <strong>Licensed &amp; Legal</strong>
            <span>Fully licensed cannabis dispensary operating in Ontario</span>
          </div>
          <div className="info-card">
            <svg viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            <strong>Reserve &amp; Pick Up</strong>
            <span>Reserve online, pay &amp; collect in-store</span>
          </div>
          <div className="info-card">
            <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 8v4l2 2" /></svg>
            <strong>Fresh Drops Weekly</strong>
            <span>New strains and products added regularly</span>
          </div>
        </div>

        <h2>Adults 19+ Only, Ontario Only</h2>
        <p>
          In accordance with Ontario law, all products and content on this site are intended
          exclusively for adults aged 19 and older physically located in Ontario, Canada.
          We are unable to serve customers outside of Ontario. Please consume responsibly.
        </p>
      </div>

      <Footer />
    </>
  );
}

import { getSiteSettings } from "@/lib/queries";
import { parsePromoMessages, parseDealBanners } from "@/lib/marketing";
import { PromoMessagesForm, DealBannersForm } from "@/components/admin/MarketingForm";

export const dynamic = "force-dynamic";

export default async function AdminMarketingPage() {
  const settings = await getSiteSettings();
  const promoMessages = parsePromoMessages(settings.promo_messages);
  const dealBanners = parseDealBanners(settings.deal_banners);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Marketing</h1>
          <p>Promo bar ticker and homepage deal banners &mdash; edit these yourself, no developer needed.</p>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ marginBottom: 16 }}>Promo Bar Ticker</h2>
        <PromoMessagesForm initial={promoMessages} />
      </div>

      <div className="admin-card">
        <h2 style={{ marginBottom: 16 }}>Homepage Deal Banners</h2>
        <p className="field-hint" style={{ marginBottom: 16 }}>
          These are the big cards at the top of the homepage. To have a product show up when a customer clicks
          &ldquo;Shop Now&rdquo; on a banner, add the matching Deal Tag (in ALL CAPS) to that product&rsquo;s Tags in{" "}
          <strong>Products</strong>.
        </p>
        <DealBannersForm initial={dealBanners} />
      </div>
    </>
  );
}

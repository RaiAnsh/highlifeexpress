import { notFound } from "next/navigation";
import { PromoBar } from "@/components/PromoBar";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { DealBuilder } from "@/components/DealBuilder";
import { getProductsByTag, getSiteSettings } from "@/lib/queries";
import { parsePromoMessages, parseDealBanners } from "@/lib/marketing";

export const dynamic = "force-dynamic";

export default async function DealPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const settings = await getSiteSettings();
  const banners = parseDealBanners(settings.deal_banners);
  const banner = banners.find((b) => b.dealTag === tag);

  if (!banner || banner.strainCount <= 0 || banner.flatPriceCents <= 0) notFound();

  const products = await getProductsByTag(tag);

  return (
    <>
      <PromoBar messages={parsePromoMessages(settings.promo_messages)} />
      <SiteNav />
      <DealBuilder banner={banner} products={products} />
      <Footer />
    </>
  );
}

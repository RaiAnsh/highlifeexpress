import { PromoBar } from "@/components/PromoBar";
import { SiteNav } from "@/components/SiteNav";
import { ShopHome } from "@/components/ShopHome";
import { Footer } from "@/components/Footer";
import { getHomepageData } from "@/lib/queries";
import { parsePromoMessages, parseDealBanners } from "@/lib/marketing";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { categories, newArrivals, bestSellers, promotionsEnabled, settings } = await getHomepageData();

  return (
    <>
      <PromoBar messages={parsePromoMessages(settings.promo_messages)} />
      <SiteNav showSearch />
      <ShopHome
        categories={categories}
        newArrivals={newArrivals}
        bestSellers={bestSellers}
        promotionsEnabled={promotionsEnabled}
        dealBanners={parseDealBanners(settings.deal_banners)}
      />
      <Footer />
    </>
  );
}

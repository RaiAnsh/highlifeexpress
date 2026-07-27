import { PromoBar } from "@/components/PromoBar";
import { SiteNav } from "@/components/SiteNav";
import { ShopHome } from "@/components/ShopHome";
import { Footer } from "@/components/Footer";
import { getHomepageData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { categories, newArrivals, bestSellers, promotionsEnabled } = await getHomepageData();

  return (
    <>
      <PromoBar />
      <SiteNav showSearch />
      <ShopHome
        categories={categories}
        newArrivals={newArrivals}
        bestSellers={bestSellers}
        promotionsEnabled={promotionsEnabled}
      />
      <Footer />
    </>
  );
}

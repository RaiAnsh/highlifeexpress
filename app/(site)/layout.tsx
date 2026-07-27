import { SiteProvider } from "@/lib/site-context";
import { AgeGate } from "@/components/AgeGate";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductModal } from "@/components/ProductModal";
import { ReservationModal } from "@/components/ReservationModal";

const AGE_GATE_SCRIPT = `if(sessionStorage.getItem('hle_age_verified')==='true'){document.body.classList.add('age-verified');}`;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteProvider>
      <script dangerouslySetInnerHTML={{ __html: AGE_GATE_SCRIPT }} />
      <AgeGate />
      <div id="site">{children}</div>
      <CartDrawer />
      <ProductModal />
      <ReservationModal />
    </SiteProvider>
  );
}

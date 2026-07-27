"use client";

import { useSite } from "@/lib/site-context";
import { fullPriceLabel, priceOptionLabel, primaryOption } from "@/lib/pricing";

const STRAIN_BADGE: Record<string, { label: string; className: string }> = {
  INDICA: { label: "Indica", className: "badge-indica" },
  SATIVA: { label: "Sativa", className: "badge-sativa" },
  HYBRID: { label: "Hybrid", className: "badge-hybrid" },
};

export function ProductModal() {
  const { activeProduct, closeProductModal, addToCart } = useSite();
  if (!activeProduct) return null;
  const strainBadge = STRAIN_BADGE[activeProduct.strainType];

  function handleAdd() {
    if (!activeProduct) return;
    const opt = primaryOption(activeProduct.priceOptions);
    if (!opt) return;
    addToCart({
      productId: activeProduct.id,
      name: activeProduct.name,
      priceLabel: priceOptionLabel(opt),
      unitPriceCents: opt.priceCents,
      imageUrl: activeProduct.imageUrl,
    });
    closeProductModal();
  }

  return (
    <div className="product-overlay open" onClick={(e) => e.target === e.currentTarget && closeProductModal()}>
      <div className="product-modal">
        <button className="product-modal-close" onClick={closeProductModal} aria-label="Close">&times;</button>
        <div className="product-modal-img">
          {activeProduct.imageUrl ? (
            <img src={activeProduct.imageUrl} alt={activeProduct.imageAlt} />
          ) : (
            <span>{"\ud83c\udf3f"}</span>
          )}
        </div>
        <div className="product-modal-body">
          <div className="badges">
            {strainBadge && <span className={`badge ${strainBadge.className}`}>{strainBadge.label}</span>}
            {activeProduct.thcPercent != null && (
              <span className="badge badge-thc">THC {activeProduct.thcPercent}%</span>
            )}
          </div>
          <div className="product-name">{activeProduct.name}</div>
          <div className="product-effects">{activeProduct.effects.join(" \u00b7 ")}</div>
          <div className="product-modal-desc">{activeProduct.description}</div>
          <div className="product-modal-footer">
            <span className="price">{fullPriceLabel(activeProduct.priceOptions)}</span>
            <button className="add-to-cart-btn" onClick={handleAdd}>ADD TO CART</button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSite } from "@/lib/site-context";
import { formatCents, fullPriceLabel, priceOptionLabel, primaryOption } from "@/lib/pricing";

const STRAIN_BADGE: Record<string, { label: string; className: string }> = {
  INDICA: { label: "Indica", className: "badge-indica" },
  SATIVA: { label: "Sativa", className: "badge-sativa" },
  HYBRID: { label: "Hybrid", className: "badge-hybrid" },
};

export function ProductModal() {
  const { activeProduct, closeProductModal, addToCart } = useSite();
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  // Reset the size selection whenever a different product is opened.
  useEffect(() => {
    setSelectedLabel(activeProduct ? primaryOption(activeProduct.priceOptions)?.label ?? null : null);
  }, [activeProduct]);

  if (!activeProduct) return null;
  const strainBadge = STRAIN_BADGE[activeProduct.strainType];
  const hasMultipleSizes = activeProduct.priceOptions.length > 1;

  function handleAdd() {
    if (!activeProduct) return;
    const opt = activeProduct.priceOptions.find((o) => o.label === selectedLabel) ?? primaryOption(activeProduct.priceOptions);
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
          {hasMultipleSizes && (
            <div className="size-picker">
              <div className="size-picker-label">Choose a size</div>
              <div className="size-picker-options">
                {activeProduct.priceOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    className={`size-pill${selectedLabel === opt.label ? " selected" : ""}`}
                    onClick={() => setSelectedLabel(opt.label)}
                  >
                    {opt.label} {"\u2014"} {formatCents(opt.priceCents)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="product-modal-footer">
            {!hasMultipleSizes && <span className="price">{fullPriceLabel(activeProduct.priceOptions)}</span>}
            <button className="add-to-cart-btn" onClick={handleAdd} disabled={hasMultipleSizes && !selectedLabel}>
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

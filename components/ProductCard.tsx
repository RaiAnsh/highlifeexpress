"use client";

import { useSite } from "@/lib/site-context";
import { formatCents, fullPriceLabel, isOnSale, priceOptionLabel, primaryOption } from "@/lib/pricing";
import type { ProductCardData } from "@/lib/types";

const STRAIN_BADGE: Record<string, { label: string; className: string }> = {
  INDICA: { label: "Indica", className: "badge-indica" },
  SATIVA: { label: "Sativa", className: "badge-sativa" },
  HYBRID: { label: "Hybrid", className: "badge-hybrid" },
};

export function ProductCard({
  product,
  imgClassIndex,
  promotionsEnabled,
}: {
  product: ProductCardData;
  imgClassIndex: number;
  promotionsEnabled: boolean;
}) {
  const { addToCart, openProductModal } = useSite();
  const strainBadge = STRAIN_BADGE[product.strainType];
  const isNew = product.tags.includes("NEW");
  const onSale = isOnSale(product.priceOptions, promotionsEnabled);

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    const opt = primaryOption(product.priceOptions);
    if (!opt) return;
    addToCart({
      productId: product.id,
      name: product.name,
      priceLabel: priceOptionLabel(opt),
      unitPriceCents: opt.priceCents,
      imageUrl: product.imageUrl,
    });
  }

  return (
    <div className="product-card" onClick={() => openProductModal(product)}>
      <div className={`product-img product-img-${imgClassIndex}`}>
        {product.imageUrl ? <img src={product.imageUrl} alt={product.imageAlt} /> : <span>{"\ud83c\udf3f"}</span>}
        {isNew && <span className="new-tag">NEW</span>}
        {!isNew && onSale && <span className="sale-tag">SALE</span>}
      </div>
      <div className="product-body">
        <div className="badges">
          {strainBadge && <span className={`badge ${strainBadge.className}`}>{strainBadge.label}</span>}
          {product.thcPercent != null && <span className="badge badge-thc">THC {product.thcPercent}%</span>}
        </div>
        <div className="product-name">{product.name}</div>
        <div className="product-effects">{product.effects.join(" \u00b7 ")}</div>
        <div className="product-footer">
          <span className="price">
            {onSale && product.priceOptions[0]?.compareAtPriceCents != null && (
              <span className="price-old">{formatCents(product.priceOptions[0].compareAtPriceCents)}</span>
            )}
            {fullPriceLabel(product.priceOptions)}
          </span>
          <button className="add-btn" onClick={handleAdd}>ADD +</button>
        </div>
      </div>
    </div>
  );
}

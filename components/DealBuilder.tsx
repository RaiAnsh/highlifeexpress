"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSite } from "@/lib/site-context";
import type { DealBanner } from "@/lib/marketing";
import type { ProductCardData } from "@/lib/types";

export function DealBuilder({ banner, products }: { banner: DealBanner; products: ProductCardData[] }) {
  const router = useRouter();
  const { addToCart, openCart } = useSite();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [justAdded, setJustAdded] = useState(false);

  const selectedProducts = useMemo(
    () => selectedIds.map((id) => products.find((p) => p.id === id)).filter((p): p is ProductCardData => Boolean(p)),
    [selectedIds, products]
  );
  const isFull = selectedIds.length >= banner.strainCount;
  const canAdd = selectedIds.length === banner.strainCount;

  function toggle(id: string) {
    setJustAdded(false);
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= banner.strainCount) return prev;
      return [...prev, id];
    });
  }

  function handleAddDeal() {
    if (!canAdd) return;
    const strainNames = selectedProducts.map((p) => p.name).join(", ");
    const freeSuffix = banner.freeItems.length > 0 ? ` + ${banner.freeItems.join(" + ")}` : "";
    const bundleId = `deal:${banner.dealTag}:${[...selectedIds].sort().join("-")}`;
    addToCart({
      productId: bundleId,
      name: `${banner.titleLine1} ${banner.titleLine2} Deal \u2014 ${strainNames}${freeSuffix}`,
      priceLabel: `${banner.titleLine1} ${banner.titleLine2} flat`,
      unitPriceCents: banner.flatPriceCents,
      imageUrl: selectedProducts[0]?.imageUrl ?? null,
    });
    setJustAdded(true);
    setSelectedIds([]);
    openCart();
  }

  if (products.length === 0) {
    return (
      <div className="no-results" style={{ padding: "60px 20px" }}>
        No strains are tagged for this deal yet {"\u2014"} check back soon!
      </div>
    );
  }

  return (
    <div className="section">
      <div className="deal-builder-header">
        <button type="button" className="admin-btn secondary" onClick={() => router.push("/")}>
          {"\u2190"} Back to Shop
        </button>
        <h1>
          {banner.titleLine1} {banner.titleLine2}
        </h1>
        {banner.description && <p>{banner.description}</p>}
        {banner.freeItems.length > 0 && (
          <p className="deal-builder-free">{banner.freeItems.join(" + ")}</p>
        )}
        <p className="deal-builder-progress">
          Pick {banner.strainCount} strain{banner.strainCount === 1 ? "" : "s"} {"\u2014"} {selectedIds.length} of{" "}
          {banner.strainCount} selected
        </p>
      </div>

      <div className="product-grid">
        {products.map((product, i) => {
          const selected = selectedIds.includes(product.id);
          const disabled = !selected && isFull;
          return (
            <div
              key={product.id}
              className={`product-card deal-pick-card${selected ? " selected" : ""}${disabled ? " disabled" : ""}`}
              onClick={() => !disabled && toggle(product.id)}
            >
              <div className={`product-img product-img-${(i % 6) + 1}`}>
                {product.imageUrl ? <img src={product.imageUrl} alt={product.imageAlt} /> : <span>{"\ud83c\udf3f"}</span>}
                {selected && <span className="new-tag">SELECTED</span>}
              </div>
              <div className="product-body">
                <div className="product-name">{product.name}</div>
                <div className="product-effects">{product.effects.join(" \u00b7 ")}</div>
                <div className="product-footer">
                  <button
                    type="button"
                    className="add-btn"
                    disabled={disabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!disabled) toggle(product.id);
                    }}
                  >
                    {selected ? "REMOVE" : "SELECT"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="deal-builder-footer">
        {justAdded && <p className="admin-success-banner">Deal added to your cart.</p>}
        <button type="button" className="hero-btn hero-btn-1" disabled={!canAdd} onClick={handleAddDeal}>
          {canAdd
            ? `Add Deal to Cart \u2014 $${(banner.flatPriceCents / 100).toFixed(0)}`
            : `Select ${banner.strainCount - selectedIds.length} more strain${banner.strainCount - selectedIds.length === 1 ? "" : "s"}`}
        </button>
      </div>
    </div>
  );
}

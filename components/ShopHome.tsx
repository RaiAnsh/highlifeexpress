"use client";

import { useMemo, useState } from "react";
import { useSite } from "@/lib/site-context";
import { isOnSale } from "@/lib/pricing";
import { splitStrainLine, type DealBanner } from "@/lib/marketing";
import { ProductCard } from "./ProductCard";
import { CategoryIcon } from "./CategoryIcon";
import type { ProductCardData } from "@/lib/types";

type Category = { slug: string; name: string };

const VIRTUAL_CATEGORIES: Category[] = [{ slug: "all", name: "Home" }];
const DEALS_CATEGORY: Category = { slug: "deals", name: "Special Deals" };

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function matches(product: ProductCardData, category: string, searchTerm: string, promotionsEnabled: boolean) {
  const matchesCategory =
    category === "all"
      ? true
      : category === "deals"
        ? product.tags.includes("SALE") || isOnSale(product.priceOptions, promotionsEnabled)
        : category.startsWith("deal")
          ? product.tags.includes(category.toUpperCase())
          : product.categorySlug === category;
  const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesCategory && matchesSearch;
}

export function ShopHome({
  categories,
  newArrivals,
  bestSellers,
  promotionsEnabled,
  dealBanners,
}: {
  categories: Category[];
  newArrivals: ProductCardData[];
  bestSellers: ProductCardData[];
  promotionsEnabled: boolean;
  dealBanners: DealBanner[];
}) {
  const { searchTerm } = useSite();
  const [currentCategory, setCurrentCategory] = useState("all");

  const allCategories = [...VIRTUAL_CATEGORIES, ...categories, DEALS_CATEGORY];

  const filteredNewArrivals = useMemo(
    () => newArrivals.filter((p) => matches(p, currentCategory, searchTerm, promotionsEnabled)),
    [newArrivals, currentCategory, searchTerm, promotionsEnabled]
  );
  const filteredBestSellers = useMemo(
    () => bestSellers.filter((p) => matches(p, currentCategory, searchTerm, promotionsEnabled)),
    [bestSellers, currentCategory, searchTerm, promotionsEnabled]
  );

  // Products without a real photo yet get a random strain photo borrowed from the
  // pool of already-uploaded photos, re-rolled on every page load, so nothing shows
  // a blank placeholder while real photography is pending.
  const fallbackPhotos = useMemo(() => {
    const pool = [...newArrivals, ...bestSellers]
      .map((p) => p.imageUrl)
      .filter((url): url is string => Boolean(url));
    const map = new Map<string, string>();
    if (pool.length > 0) {
      [...newArrivals, ...bestSellers].forEach((p) => {
        if (!p.imageUrl) map.set(p.id, pool[Math.floor(Math.random() * pool.length)]);
      });
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function withFallbackPhoto(product: ProductCardData): ProductCardData {
    return product.imageUrl ? product : { ...product, imageUrl: fallbackPhotos.get(product.id) ?? null };
  }

  const totalVisible = filteredNewArrivals.length + filteredBestSellers.length;

  function shopNow(sectionId: string, cat: string) {
    setCurrentCategory(cat);
    scrollTo(sectionId);
  }

  return (
    <>
      {/* Category Nav */}
      <div className="cat-nav">
        {allCategories.map((cat) => (
          <a
            key={cat.slug}
            href="#"
            className={`cat-item${currentCategory === cat.slug ? " active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentCategory(cat.slug);
            }}
          >
            <CategoryIcon slug={cat.slug} />
            <span>{cat.name}</span>
          </a>
        ))}
      </div>

      {totalVisible === 0 && (
        <div className="no-results" style={{ padding: "60px 20px" }}>
          {searchTerm ? `No products match "${searchTerm}".` : "No products in this category yet \u2014 check back soon!"}
        </div>
      )}

      {/* Deal Banners */}
      {dealBanners.length > 0 && (
        <div className="hero-grid">
          {dealBanners.map((banner, i) => {
            const variant = (i % 4) + 1;
            return (
              <div className={`hero-card hero-card-${variant}`} key={i}>
                <div className="eyebrow">{banner.eyebrow}</div>
                <h2>
                  {banner.titleLine1}
                  <br />
                  {banner.titleLine2}
                </h2>
                <p>{banner.description}</p>
                {banner.strainLines.length > 0 && (
                  <div className="hero-deal-strains">
                    {banner.strainLines.map((line, j) => {
                      const { prefix, items } = splitStrainLine(line);
                      return (
                        <div key={j}>
                          {prefix && <strong>{prefix}</strong>} {items.join(" \u00b7 ")}
                        </div>
                      );
                    })}
                  </div>
                )}
                {banner.limitText && <p className="hero-deal-limit">{banner.limitText}</p>}
                {banner.badges.length > 0 && (
                  <div className="hero-deal-badges">
                    {banner.badges.map((b, k) => (
                      <span className="hero-deal-badge" key={k}>{b} &#10003;</span>
                    ))}
                  </div>
                )}
                <button className={`hero-btn hero-btn-${variant}`} onClick={() => shopNow("new-arrivals", banner.dealTag || "all")}>
                  {banner.buttonLabel || "Shop Now"}
                  <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* New Arrivals */}
      {filteredNewArrivals.length > 0 && (
        <div className="section" id="new-arrivals">
          <div className="section-header">
            <h2>New Arrivals</h2>
            <button onClick={() => shopNow("new-arrivals", "all")}>View All &rarr;</button>
          </div>
          <div className="product-grid">
            {filteredNewArrivals.map((product, i) => (
              <ProductCard key={product.id} product={withFallbackPhoto(product)} imgClassIndex={(i % 6) + 1} promotionsEnabled={promotionsEnabled} />
            ))}
          </div>
        </div>
      )}

      {/* Promo Strip */}
      <div className="banner-strip">
        <h2>Ready to shop? <span>Reserve online</span>, pick up in-store.</h2>
        <button className="banner-cta" onClick={() => shopNow("new-arrivals", "all")}>SHOP NOW &rarr;</button>
      </div>

      {/* Best Sellers */}
      {filteredBestSellers.length > 0 && (
        <div className="section" id="best-sellers">
          <div className="section-header">
            <h2>Best Sellers</h2>
            <button onClick={() => shopNow("best-sellers", "all")}>View All &rarr;</button>
          </div>
          <div className="product-grid">
            {filteredBestSellers.map((product, i) => (
              <ProductCard key={product.id} product={withFallbackPhoto(product)} imgClassIndex={(i % 6) + 1} promotionsEnabled={promotionsEnabled} />
            ))}
          </div>
        </div>
      )}

      {/* Delivery Area */}
      <div className="section" id="delivery-area">
        <div className="section-header">
          <h2>Delivery Area</h2>
        </div>
        <div className="delivery-grid">
          <div className="delivery-map">
            <iframe
              title="High Life Express delivery area map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-80.2%2C43.55%2C-79.0%2C44.45&layer=mapnik&marker=44.05%2C-79.46"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="delivery-info">
            <ul className="delivery-locations">
              <li>Barrie</li>
              <li>Innisfil</li>
              <li>Cooktown</li>
              <li>Angus</li>
              <li>Beeton</li>
              <li>Belle Ewart</li>
              <li>Keswick</li>
              <li>Newmarket</li>
              <li>Aurora</li>
              <li>Richmond Hill</li>
              <li>North York</li>
              <li>Mississauga</li>
              <li>Brampton</li>
              <li>Etobicoke</li>
              <li>Scarborough</li>
            </ul>
            <p className="delivery-more">More locations coming soon!</p>
            <p className="delivery-note">
              For new customers: please confirm your delivery location before ordering. Some areas may take longer for delivery.
            </p>
            <p className="delivery-note">Pre-orders are available.</p>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="trust-bar" id="trust">
        <div className="trust-item">
          <svg viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          <strong>Reserve &amp; Pick Up</strong>
          <span>Reserve online, pay &amp; collect in-store</span>
        </div>
        <div className="trust-item">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>
          <strong>Licensed Dispensary</strong>
          <span>Certified &amp; legal in Ontario</span>
        </div>
        <div className="trust-item">
          <svg viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          <strong>Ontario Only</strong>
          <span>Proudly serving adults 19+ in Ontario</span>
        </div>
      </div>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSite } from "@/lib/site-context";
import { isOnSale } from "@/lib/pricing";
import { splitStrainLine, type DealBanner } from "@/lib/marketing";
import { ProductCard } from "./ProductCard";
import { CategoryIcon } from "./CategoryIcon";
import type { ProductCardData } from "@/lib/types";

// Leaflet touches `window` at import time, so it can only run client-side.
const DeliveryMap = dynamic(() => import("./DeliveryMap").then((m) => m.DeliveryMap), {
  ssr: false,
  loading: () => <div className="delivery-map-loading">Loading map...</div>,
});

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
        ? product.tags.includes("SALE") ||
          isOnSale(product.priceOptions, promotionsEnabled) ||
          product.tags.some((t) => t.toUpperCase().startsWith("DEAL"))
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

  // Products without a real photo yet get a strain photo borrowed from the pool of
  // already-uploaded photos. The pick is deterministic (hashed from the product id)
  // so server and client render the same src — a random pick here caused a hydration
  // mismatch that broke React event handlers (e.g. category nav clicks) sitewide.
  const fallbackPhotos = useMemo(() => {
    const pool = [...newArrivals, ...bestSellers]
      .map((p) => p.imageUrl)
      .filter((url): url is string => Boolean(url));
    const map = new Map<string, string>();
    if (pool.length > 0) {
      [...newArrivals, ...bestSellers].forEach((p) => {
        if (!p.imageUrl) {
          let hash = 0;
          for (let i = 0; i < p.id.length; i++) hash = (hash * 31 + p.id.charCodeAt(i)) >>> 0;
          map.set(p.id, pool[hash % pool.length]);
        }
      });
    }
    return map;
  }, [newArrivals, bestSellers]);

  function withFallbackPhoto(product: ProductCardData): ProductCardData {
    return product.imageUrl ? product : { ...product, imageUrl: fallbackPhotos.get(product.id) ?? null };
  }

  const totalVisible = filteredNewArrivals.length + filteredBestSellers.length;

  function shopNow(sectionId: string, cat: string) {
    setCurrentCategory(cat);
    scrollTo(sectionId);
  }

  function selectCategory(cat: string) {
    setCurrentCategory(cat);
    // The hero deal-banners only render on "Home" — once a specific category is
    // chosen, jump straight to the (now banner-free) results instead of leaving
    // the customer stuck behind the tall banner grid.
    if (cat !== "all") {
      requestAnimationFrame(() => scrollTo("results-top"));
    } else {
      scrollTo("cat-nav-anchor");
    }
  }

  return (
    <>
      {/* Category Nav */}
      <div id="cat-nav-anchor" />
      <div className="cat-nav">
        {allCategories.map((cat) => (
          <a
            key={cat.slug}
            href="#"
            className={`cat-item${currentCategory === cat.slug ? " active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              selectCategory(cat.slug);
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

      <div id="results-top" />

      {/* Deal Banners — only shown on the unfiltered "Home" view so they don't bury filtered results */}
      {currentCategory === "all" && dealBanners.length > 0 && (
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
        <h2>Ready to shop? <span>Order online</span>, delivered to your door.</h2>
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
            <DeliveryMap />
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
              <li>Toronto</li>
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
          <strong>Delivery Only</strong>
          <span>Order online, delivered right to your door</span>
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

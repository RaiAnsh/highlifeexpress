import type { PriceOptionData } from "./types";

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export function isOnSale(priceOptions: PriceOptionData[], promotionsEnabled: boolean): boolean {
  if (!promotionsEnabled) return false;
  return priceOptions.some((p) => p.compareAtPriceCents != null && p.compareAtPriceCents > p.priceCents);
}

/** Plain-text price label, e.g. "$50/14g · $95/oz" — used for cart snapshots. */
export function priceOptionLabel(p: PriceOptionData): string {
  return `${formatCents(p.priceCents)}/${p.label}`;
}

export function fullPriceLabel(priceOptions: PriceOptionData[]): string {
  return priceOptions.map(priceOptionLabel).join(" \u00b7 ");
}

/** First-listed option — used as the default when adding a card's whole product to cart
 *  (matches legacy behaviour of picking the first price shown on the card). */
export function primaryOption(priceOptions: PriceOptionData[]): PriceOptionData | null {
  return priceOptions[0] ?? null;
}

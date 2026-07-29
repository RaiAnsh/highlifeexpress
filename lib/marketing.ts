// Shared types + defaults for client-editable marketing content (promo bar ticker
// and homepage deal banners). Backed by SiteSetting rows ("promo_messages",
// "deal_banners") storing JSON. Defaults here match the original hardcoded copy so
// the site looks identical until the client edits something in /admin/marketing.

export type DealBanner = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  /** Lines like "H: Zesty Citrus, Cookie Cream, Oreo" — prefix before the colon, comma-separated strains after. */
  strainLines: string[];
  limitText: string;
  badges: string[];
  buttonLabel: string;
  /** Lowercase, matches a product tag (uppercased) for filtering, e.g. "deal3oz140" -> tag "DEAL3OZ140". */
  dealTag: string;
  /** How many different strains the customer picks for this deal. 0 = no bundle builder, "Shop Now" just filters. */
  strainCount: number;
  /** Flat bundle price in cents charged once the customer has picked strainCount strains. 0 = no bundle builder. */
  flatPriceCents: number;
  /** Free bonus items shown on the deal page and auto-included in the cart line, e.g. "14g flower FREE". */
  freeItems: string[];
};

export const DEFAULT_PROMO_MESSAGES = [
  "SAME DAY DELIVERY \u2014 DELIVERY WITHIN 1-3 HRS",
  "SERVING ONTARIO (19+) ONLY",
  "LICENSED ONTARIO DELIVERY SERVICE",
  "FREE DELIVERY",
  "PHONE: 647 551-0846 \u00b7 MINIMUM ORDER $60 FOR FREE DELIVERY",
  "PREMIUM QUALITY GUARANTEED",
  "NEW STRAINS DROPPING WEEKLY",
  "ORDER ONLINE \u2014 DELIVERED TO YOUR DOOR",
];

export const DEFAULT_DEAL_BANNERS: DealBanner[] = [
  {
    eyebrow: "Limited Deal",
    titleLine1: "3oz for",
    titleLine2: "$140",
    description: "+ 14g FREE + 6pc edible FREE. Hand-selected Indica, Sativa & Hybrid strains.",
    strainLines: [],
    limitText: "Limit 1oz per customer",
    badges: ["Quality BUDS", "Free Delivery", "Cash & e-Transfer"],
    buttonLabel: "Shop Now",
    dealTag: "deal3oz140",
    strainCount: 3,
    flatPriceCents: 14000,
    freeItems: ["14g flower FREE", "6pc edible FREE"],
  },
  {
    eyebrow: "Limited Deal",
    titleLine1: "3oz for",
    titleLine2: "$190",
    description: "+ 14g FREE + 6pc edible FREE. High quality hand-selected flowers.",
    strainLines: [],
    limitText: "Limit 1oz per customer",
    badges: ["Quality BUDS", "Free Delivery", "Cash & e-Transfer"],
    buttonLabel: "Shop Now",
    dealTag: "deal3oz190",
    strainCount: 3,
    flatPriceCents: 19000,
    freeItems: ["14g flower FREE", "6pc edible FREE"],
  },
  {
    eyebrow: "",
    titleLine1: "Premium",
    titleLine2: "Flower",
    description: "Coming soon!",
    strainLines: [],
    limitText: "",
    badges: [],
    buttonLabel: "Shop Now",
    dealTag: "premiumflower",
    strainCount: 0,
    flatPriceCents: 0,
    freeItems: [],
  },
];

export function parsePromoMessages(raw: string | undefined): string[] {
  if (!raw) return DEFAULT_PROMO_MESSAGES;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed.every((m) => typeof m === "string")) {
      return parsed;
    }
  } catch {
    // fall through to default
  }
  return DEFAULT_PROMO_MESSAGES;
}

export function parseDealBanners(raw: string | undefined): DealBanner[] {
  if (!raw) return DEFAULT_DEAL_BANNERS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Backfill fields added after some SiteSetting rows were already saved, so
      // older admin-edited banners don't lose the bundle builder silently.
      return (parsed as Partial<DealBanner>[]).map((b) => ({
        eyebrow: b.eyebrow ?? "",
        titleLine1: b.titleLine1 ?? "",
        titleLine2: b.titleLine2 ?? "",
        description: b.description ?? "",
        strainLines: b.strainLines ?? [],
        limitText: b.limitText ?? "",
        badges: b.badges ?? [],
        buttonLabel: b.buttonLabel ?? "Shop Now",
        dealTag: b.dealTag ?? "",
        strainCount: b.strainCount ?? 0,
        flatPriceCents: b.flatPriceCents ?? 0,
        freeItems: b.freeItems ?? [],
      }));
    }
  } catch {
    // fall through to default
  }
  return DEFAULT_DEAL_BANNERS;
}

/** Splits a "PREFIX: item1, item2" strain line into its parts for rendering. */
export function splitStrainLine(line: string): { prefix: string; items: string[] } {
  const idx = line.indexOf(":");
  if (idx === -1) return { prefix: "", items: [line.trim()].filter(Boolean) };
  const prefix = line.slice(0, idx).trim();
  const items = line
    .slice(idx + 1)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return { prefix, items };
}

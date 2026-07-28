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
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as DealBanner[];
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

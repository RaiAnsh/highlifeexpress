import { prisma } from "./prisma";
import type { ProductCardData } from "./types";

function toCardData(product: {
  id: string;
  slug: string;
  name: string;
  strainType: string;
  thcPercent: unknown;
  effects: string[];
  description: string;
  tags: string[];
  category: { slug: string };
  priceOptions: { id: string; label: string; priceCents: number; compareAtPriceCents: number | null; sortOrder: number }[];
  photos: { url: string; altText: string | null; isPrimary: boolean; sortOrder: number }[];
}): ProductCardData {
  const primaryPhoto =
    product.photos.find((p) => p.isPrimary) ??
    [...product.photos].sort((a, b) => a.sortOrder - b.sortOrder)[0] ??
    null;
  const priceOptions = [...product.priceOptions].sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    categorySlug: product.category.slug,
    strainType: product.strainType as ProductCardData["strainType"],
    thcPercent: product.thcPercent == null ? null : Number(product.thcPercent),
    effects: product.effects,
    description: product.description,
    tags: product.tags,
    imageUrl: primaryPhoto?.url ?? null,
    imageAlt: primaryPhoto?.altText ?? product.name,
    priceOptions: priceOptions.map((p) => ({
      id: p.id,
      label: p.label,
      priceCents: p.priceCents,
      compareAtPriceCents: p.compareAtPriceCents,
    })),
  };
}

const productInclude = {
  category: { select: { slug: true } },
  priceOptions: true,
  photos: true,
} as const;

export async function getHomepageData() {
  const [categories, newArrivals, bestSellers, promoSetting] = await Promise.all([
    prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: { active: true, featuredSection: "NEW_ARRIVALS" },
      orderBy: { sortOrder: "asc" },
      include: productInclude,
    }),
    prisma.product.findMany({
      where: { active: true, featuredSection: "BEST_SELLERS" },
      orderBy: { sortOrder: "asc" },
      include: productInclude,
    }),
    prisma.siteSetting.findUnique({ where: { key: "promotions_enabled" } }),
  ]);

  return {
    categories,
    newArrivals: newArrivals.map(toCardData),
    bestSellers: bestSellers.map(toCardData),
    promotionsEnabled: promoSetting?.value === "true",
  };
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

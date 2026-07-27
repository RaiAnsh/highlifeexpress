export type PriceOptionData = {
  id: string;
  label: string;
  priceCents: number;
  compareAtPriceCents: number | null;
};

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  strainType: "INDICA" | "SATIVA" | "HYBRID" | "NA";
  thcPercent: number | null;
  effects: string[];
  description: string;
  tags: string[];
  imageUrl: string | null;
  imageAlt: string;
  priceOptions: PriceOptionData[];
};

export type CartItem = {
  productId: string;
  name: string;
  priceLabel: string;
  unitPriceCents: number;
  imageUrl: string | null;
  qty: number;
};

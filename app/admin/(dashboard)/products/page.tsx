import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductsTable } from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ name: "asc" }],
    include: {
      category: { select: { name: true } },
      photos: { where: { isPrimary: true }, take: 1 },
      priceOptions: { orderBy: { sortOrder: "asc" } },
    },
  });

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Products</h1>
          <p>{products.length} product{products.length === 1 ? "" : "s"} in the catalog.</p>
          <p className="field-hint">
            Click a price below to edit it right here{"\u2014"}each product only lives in one place, so the change
            shows up everywhere it&apos;s displayed (its category, New Arrivals, Best Sellers) instantly.
          </p>
        </div>
        <Link className="admin-btn" href="/admin/products/new">+ Add Product</Link>
      </div>

      <ProductsTable
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          categoryName: p.category.name,
          active: p.active,
          featuredSection: p.featuredSection,
          thumbUrl: p.photos[0]?.url ?? null,
          prices: p.priceOptions.map((po) => ({ id: po.id, label: po.label, priceCents: po.priceCents })),
        }))}
      />
    </>
  );
}

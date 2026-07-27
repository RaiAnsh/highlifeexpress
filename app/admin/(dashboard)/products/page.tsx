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
      priceOptions: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Products</h1>
          <p>{products.length} product{products.length === 1 ? "" : "s"} in the catalog.</p>
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
          priceLabel: p.priceOptions[0] ? `${p.priceOptions[0].label} — $${(p.priceOptions[0].priceCents / 100).toFixed(2)}` : "No price set",
        }))}
      />
    </>
  );
}

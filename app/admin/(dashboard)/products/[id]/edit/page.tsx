import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductPhotoManager } from "@/components/admin/ProductPhotoManager";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { priceOptions: { orderBy: { sortOrder: "asc" } }, photos: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Edit Product</h1>
          <p>{product.name}</p>
        </div>
      </div>

      <div className="admin-card">
        <ProductForm
          mode="edit"
          productId={product.id}
          categories={categories}
          initial={{
            name: product.name,
            slug: product.slug,
            categoryId: product.categoryId,
            strainType: product.strainType,
            thcPercent: product.thcPercent == null ? "" : String(product.thcPercent),
            effects: product.effects.join(", "),
            description: product.description,
            tags: product.tags as ("NEW" | "SALE")[],
            featuredSection: product.featuredSection,
            active: product.active,
            sortOrder: product.sortOrder,
            priceOptions: product.priceOptions.map((po) => ({
              label: po.label,
              price: (po.priceCents / 100).toFixed(2),
              compareAt: po.compareAtPriceCents != null ? (po.compareAtPriceCents / 100).toFixed(2) : "",
            })),
          }}
        />
      </div>

      <ProductPhotoManager
        productId={product.id}
        photos={product.photos.map((p) => ({ id: p.id, url: p.url, altText: p.altText, isPrimary: p.isPrimary }))}
      />
    </>
  );
}

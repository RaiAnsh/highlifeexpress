import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Add Product</h1>
          <p>Photos can be added after the product is created.</p>
        </div>
      </div>
      <div className="admin-card">
        <ProductForm mode="create" categories={categories} />
      </div>
    </>
  );
}

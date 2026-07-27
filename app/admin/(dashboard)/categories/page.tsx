import { prisma } from "@/lib/prisma";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Categories</h1>
          <p>Manage the shop categories used to organize products.</p>
        </div>
      </div>
      <CategoriesManager
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          sortOrder: c.sortOrder,
          active: c.active,
          productCount: c._count.products,
        }))}
      />
    </>
  );
}

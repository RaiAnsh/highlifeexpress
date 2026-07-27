"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/categories";

type Category = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  active: boolean;
  productCount: number;
};

function slugify(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const input = {
      name: String(data.get("name") ?? ""),
      slug: String(data.get("slug") ?? ""),
      sortOrder: String(data.get("sortOrder") ?? "0"),
      active: data.get("active") === "on",
    };
    startTransition(async () => {
      const result = await createCategory(input);
      if (result.ok) {
        setShowNew(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function handleUpdate(id: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const input = {
      name: String(data.get("name") ?? ""),
      slug: String(data.get("slug") ?? ""),
      sortOrder: String(data.get("sortOrder") ?? "0"),
      active: data.get("active") === "on",
    };
    startTransition(async () => {
      const result = await updateCategory(id, input);
      if (result.ok) {
        setEditingId(null);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this category? This cannot be undone.")) return;
    setError("");
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="admin-card">
      {error && <p className="admin-error-banner" style={{ marginBottom: 16 }}>{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Sort</th>
            <th>Status</th>
            <th>Products</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) =>
            editingId === cat.id ? (
              <tr key={cat.id}>
                <td colSpan={6}>
                  <form onSubmit={(e) => handleUpdate(cat.id, e)} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <input name="name" defaultValue={cat.name} required style={{ padding: 8, border: "1px solid var(--border)", borderRadius: 6 }} />
                    <input name="slug" defaultValue={cat.slug} required style={{ padding: 8, border: "1px solid var(--border)", borderRadius: 6 }} />
                    <input name="sortOrder" type="number" defaultValue={cat.sortOrder} style={{ width: 70, padding: 8, border: "1px solid var(--border)", borderRadius: 6 }} />
                    <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
                      <input type="checkbox" name="active" defaultChecked={cat.active} /> Active
                    </label>
                    <button type="submit" className="admin-btn" disabled={isPending}>Save</button>
                    <button type="button" className="admin-btn secondary" onClick={() => setEditingId(null)}>Cancel</button>
                  </form>
                </td>
              </tr>
            ) : (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.slug}</td>
                <td>{cat.sortOrder}</td>
                <td>
                  <span className={`admin-badge ${cat.active ? "on" : "off"}`}>{cat.active ? "Active" : "Inactive"}</span>
                </td>
                <td>{cat.productCount}</td>
                <td className="actions">
                  <button className="admin-btn secondary" onClick={() => setEditingId(cat.id)}>Edit</button>
                  <button className="admin-btn danger" onClick={() => handleDelete(cat.id)} disabled={isPending}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <div style={{ marginTop: 20 }}>
        {showNew ? (
          <form onSubmit={handleCreate} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <input
              name="name"
              placeholder="Name"
              required
              onChange={(e) => {
                const slugInput = e.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement | null;
                if (slugInput && !slugInput.dataset.touched) slugInput.value = slugify(e.currentTarget.value);
              }}
              style={{ padding: 8, border: "1px solid var(--border)", borderRadius: 6 }}
            />
            <input
              name="slug"
              placeholder="slug"
              required
              onChange={(e) => (e.currentTarget.dataset.touched = "true")}
              style={{ padding: 8, border: "1px solid var(--border)", borderRadius: 6 }}
            />
            <input name="sortOrder" type="number" placeholder="Sort" defaultValue={categories.length} style={{ width: 70, padding: 8, border: "1px solid var(--border)", borderRadius: 6 }} />
            <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
              <input type="checkbox" name="active" defaultChecked /> Active
            </label>
            <button type="submit" className="admin-btn" disabled={isPending}>Add Category</button>
            <button type="button" className="admin-btn secondary" onClick={() => setShowNew(false)}>Cancel</button>
          </form>
        ) : (
          <button className="admin-btn" onClick={() => setShowNew(true)}>+ Add Category</button>
        )}
      </div>
    </div>
  );
}

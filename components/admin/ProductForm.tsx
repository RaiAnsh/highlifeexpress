"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createProduct, updateProduct } from "@/app/actions/products";

type Category = { id: string; name: string };

type PriceRow = { label: string; price: string; compareAt: string };

export type ProductFormInitial = {
  name: string;
  slug: string;
  categoryId: string;
  strainType: "INDICA" | "SATIVA" | "HYBRID" | "NA";
  thcPercent: string;
  effects: string;
  description: string;
  tags: string[];
  featuredSection: "NEW_ARRIVALS" | "BEST_SELLERS" | "NONE";
  active: boolean;
  sortOrder: number;
  priceOptions: PriceRow[];
};

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const EMPTY: ProductFormInitial = {
  name: "",
  slug: "",
  categoryId: "",
  strainType: "NA",
  thcPercent: "",
  effects: "",
  description: "",
  tags: [],
  featuredSection: "NONE",
  active: true,
  sortOrder: 0,
  priceOptions: [{ label: "oz", price: "", compareAt: "" }],
};

export function ProductForm({
  mode,
  productId,
  categories,
  initial,
}: {
  mode: "create" | "edit";
  productId?: string;
  categories: Category[];
  initial?: ProductFormInitial;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [form, setForm] = useState<ProductFormInitial>(initial ?? EMPTY);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  function updatePriceRow(i: number, field: keyof PriceRow, value: string) {
    setForm((f) => ({
      ...f,
      priceOptions: f.priceOptions.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)),
    }));
  }

  function addPriceRow() {
    setForm((f) => ({ ...f, priceOptions: [...f.priceOptions, { label: "", price: "", compareAt: "" }] }));
  }

  function removePriceRow(i: number) {
    setForm((f) => ({ ...f, priceOptions: f.priceOptions.filter((_, idx) => idx !== i) }));
  }

  function toggleTag(tag: "NEW" | "SALE") {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const input = {
      name: form.name,
      slug: form.slug,
      categoryId: form.categoryId,
      strainType: form.strainType,
      thcPercent: form.thcPercent,
      effects: form.effects,
      description: form.description,
      tags: form.tags,
      featuredSection: form.featuredSection,
      active: form.active,
      sortOrder: form.sortOrder,
      priceOptions: form.priceOptions
        .filter((r) => r.label.trim() && r.price.trim())
        .map((r) => ({
          label: r.label,
          priceCents: Math.round(parseFloat(r.price) * 100),
          compareAtPriceCents: r.compareAt.trim() ? Math.round(parseFloat(r.compareAt) * 100) : "",
        })),
    };

    startTransition(async () => {
      const result = mode === "create" ? await createProduct(input) : await updateProduct(productId!, input);
      if (result.ok) {
        if (mode === "create" && result.id) {
          router.push(`/admin/products/${result.id}/edit`);
        } else {
          router.refresh();
        }
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {error && <p className="admin-error-banner">{error}</p>}

      <div>
        <label>Name</label>
        <input
          value={form.name}
          required
          onChange={(e) => {
            const name = e.target.value;
            setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
          }}
        />
      </div>

      <div>
        <label>Slug</label>
        <input
          value={form.slug}
          required
          onChange={(e) => {
            setSlugTouched(true);
            setForm((f) => ({ ...f, slug: e.target.value }));
          }}
        />
      </div>

      <div>
        <label>Category</label>
        <select value={form.categoryId} required onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
          <option value="">Select a category...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label>Strain Type</label>
          <select value={form.strainType} onChange={(e) => setForm((f) => ({ ...f, strainType: e.target.value as ProductFormInitial["strainType"] }))}>
            <option value="INDICA">Indica</option>
            <option value="SATIVA">Sativa</option>
            <option value="HYBRID">Hybrid</option>
            <option value="NA">N/A</option>
          </select>
        </div>
        <div>
          <label>THC %</label>
          <input type="number" step="0.1" min="0" max="100" value={form.thcPercent} onChange={(e) => setForm((f) => ({ ...f, thcPercent: e.target.value }))} />
        </div>
      </div>

      <div>
        <label>Effects (comma-separated)</label>
        <input value={form.effects} placeholder="Relaxation, Euphoria, Pain" onChange={(e) => setForm((f) => ({ ...f, effects: e.target.value }))} />
      </div>

      <div>
        <label>Description</label>
        <textarea value={form.description} required onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
      </div>

      <div>
        <label>Price Options</label>
        {form.priceOptions.map((row, i) => (
          <div className="admin-price-row" key={i}>
            <input placeholder="Label (e.g. 14g)" value={row.label} onChange={(e) => updatePriceRow(i, "label", e.target.value)} />
            <input type="number" step="0.01" min="0" placeholder="Price $" value={row.price} onChange={(e) => updatePriceRow(i, "price", e.target.value)} />
            <input type="number" step="0.01" min="0" placeholder="Compare-at $ (optional)" value={row.compareAt} onChange={(e) => updatePriceRow(i, "compareAt", e.target.value)} />
            <button type="button" className="admin-btn danger" onClick={() => removePriceRow(i)}>Remove</button>
          </div>
        ))}
        <button type="button" className="admin-btn secondary" onClick={addPriceRow}>+ Add Price Option</button>
        <p className="field-hint">Compare-at price only displays storefront-side if promotions are enabled in Settings.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label>Featured Section</label>
          <select value={form.featuredSection} onChange={(e) => setForm((f) => ({ ...f, featuredSection: e.target.value as ProductFormInitial["featuredSection"] }))}>
            <option value="NONE">None</option>
            <option value="NEW_ARRIVALS">New Arrivals</option>
            <option value="BEST_SELLERS">Best Sellers</option>
          </select>
        </div>
        <div>
          <label>Sort Order</label>
          <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value, 10) || 0 }))} />
        </div>
      </div>

      <div>
        <label>Tags</label>
        <div className="checkbox-row">
          <input type="checkbox" checked={form.tags.includes("NEW")} onChange={() => toggleTag("NEW")} id="tag-new" />
          <label htmlFor="tag-new" style={{ marginBottom: 0 }}>NEW</label>
        </div>
        <div className="checkbox-row">
          <input type="checkbox" checked={form.tags.includes("SALE")} onChange={() => toggleTag("SALE")} id="tag-sale" />
          <label htmlFor="tag-sale" style={{ marginBottom: 0 }}>SALE</label>
        </div>
      </div>

      <div className="checkbox-row">
        <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} id="active" />
        <label htmlFor="active" style={{ marginBottom: 0 }}>Active (visible on storefront)</label>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn" disabled={isPending}>
          {isPending ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

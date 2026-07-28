"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct, toggleProductActive, updateProductQuickPrices } from "@/app/actions/products";

type Price = { id: string; label: string; priceCents: number };

type Row = {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  active: boolean;
  featuredSection: "NEW_ARRIVALS" | "BEST_SELLERS" | "NONE";
  thumbUrl: string | null;
  prices: Price[];
};

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function PriceCell({ productId, prices }: { productId: string; prices: Price[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Record<string, string>>({});

  function startEdit() {
    setDraft(Object.fromEntries(prices.map((p) => [p.id, (p.priceCents / 100).toFixed(2)])));
    setError("");
    setEditing(true);
  }

  function save() {
    setError("");
    const payload = prices.map((p) => ({ id: p.id, priceCents: Math.round(parseFloat(draft[p.id]) * 100) }));
    if (payload.some((p) => !Number.isFinite(p.priceCents) || p.priceCents <= 0)) {
      setError("Enter a valid price");
      return;
    }
    startTransition(async () => {
      const result = await updateProductQuickPrices(productId, { prices: payload });
      if (result.ok) {
        setEditing(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  if (prices.length === 0) {
    return <span className="admin-muted">No price set</span>;
  }

  if (!editing) {
    return (
      <button type="button" className="price-cell-edit" onClick={startEdit} title="Click to edit price">
        {prices.map((p) => `${p.label} — ${formatPrice(p.priceCents)}`).join(" \u00b7 ")}
      </button>
    );
  }

  return (
    <div className="price-cell-editing" onKeyDown={(e) => e.key === "Enter" && save()}>
      {prices.map((p) => (
        <div key={p.id} className="price-cell-row">
          <span>{p.label}</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className="price-cell-input"
            value={draft[p.id] ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, [p.id]: e.target.value }))}
            autoFocus
          />
        </div>
      ))}
      {error && <p className="admin-error-banner" style={{ margin: "4px 0" }}>{error}</p>}
      <div className="price-cell-actions">
        <button type="button" className="admin-btn" disabled={isPending} onClick={save}>
          {isPending ? "Saving..." : "Save"}
        </button>
        <button type="button" className="admin-btn secondary" disabled={isPending} onClick={() => setEditing(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}

const SECTION_ORDER: Row["featuredSection"][] = ["NEW_ARRIVALS", "BEST_SELLERS", "NONE"];
const SECTION_LABEL: Record<Row["featuredSection"], string> = {
  NEW_ARRIVALS: "New Arrivals",
  BEST_SELLERS: "Best Sellers",
  NONE: "Not Featured",
};

export function ProductsTable({ products }: { products: Row[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );

  const groups = useMemo(() => {
    const map = new Map<Row["featuredSection"], Row[]>();
    filtered.forEach((p) => {
      const list = map.get(p.featuredSection) ?? [];
      list.push(p);
      map.set(p.featuredSection, list);
    });
    return SECTION_ORDER.filter((section) => map.has(section)).map((section) => [section, map.get(section)!] as const);
  }, [filtered]);

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteProduct(id);
      router.refresh();
    });
  }

  function handleToggleActive(id: string, active: boolean) {
    startTransition(async () => {
      await toggleProductActive(id, active);
      router.refresh();
    });
  }

  function renderTable(rows: Row[]) {
    return (
      <table className="admin-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              <td>
                {p.thumbUrl ? (
                  <img className="thumb" src={p.thumbUrl} alt="" />
                ) : (
                  <div className="thumb no-photo">No Photo</div>
                )}
              </td>
              <td>{p.name}</td>
              <td>{p.categoryName}</td>
              <td><PriceCell productId={p.id} prices={p.prices} /></td>
              <td>
                <span className={`admin-badge ${p.active ? "on" : "off"}`}>{p.active ? "Active" : "Hidden"}</span>
              </td>
              <td className="actions">
                <Link className="admin-btn secondary" href={`/admin/products/${p.id}/edit`}>Edit</Link>
                <button className="admin-btn secondary" disabled={isPending} onClick={() => handleToggleActive(p.id, !p.active)}>
                  {p.active ? "Hide" : "Show"}
                </button>
                <button className="admin-btn danger" disabled={isPending} onClick={() => handleDelete(p.id, p.name)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="admin-card">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 10, border: "1px solid var(--border)", borderRadius: 8, width: "100%", maxWidth: 320, marginBottom: 20 }}
      />

      {filtered.length === 0 ? (
        <p className="admin-empty">No products found.</p>
      ) : (
        groups.map(([section, rows]) => (
          <div className="admin-table-group" key={section}>
            <h3>{SECTION_LABEL[section]} &middot; {rows.length}</h3>
            {renderTable(rows)}
          </div>
        ))
      )}
    </div>
  );
}

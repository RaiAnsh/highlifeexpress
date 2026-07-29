"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updatePromoMessages, updateDealBanners } from "@/app/actions/marketing";
import type { DealBanner } from "@/lib/marketing";

export function PromoMessagesForm({ initial }: { initial: string[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [text, setText] = useState(initial.join("\n"));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const messages = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    startTransition(async () => {
      const result = await updatePromoMessages(messages);
      if (result.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {error && <p className="admin-error-banner">{error}</p>}
      {success && <p className="admin-success-banner">Promo bar messages saved.</p>}
      <div>
        <label>Ticker Messages (one per line)</label>
        <textarea style={{ minHeight: 200 }} value={text} onChange={(e) => setText(e.target.value)} />
        <p className="field-hint">These scroll across the top bar on every page, in order, on a loop.</p>
      </div>
      <div className="admin-form-actions">
        <button type="submit" className="admin-btn" disabled={isPending}>
          {isPending ? "Saving..." : "Save Messages"}
        </button>
      </div>
    </form>
  );
}

type BannerFormRow = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  strainLinesText: string;
  limitText: string;
  badgesText: string;
  buttonLabel: string;
  dealTag: string;
  strainCount: string;
  flatPriceDollars: string;
  freeItemsText: string;
};

function toFormRow(b: DealBanner): BannerFormRow {
  return {
    eyebrow: b.eyebrow,
    titleLine1: b.titleLine1,
    titleLine2: b.titleLine2,
    description: b.description,
    strainLinesText: b.strainLines.join("\n"),
    limitText: b.limitText,
    badgesText: b.badges.join(", "),
    buttonLabel: b.buttonLabel,
    dealTag: b.dealTag,
    strainCount: b.strainCount ? String(b.strainCount) : "",
    flatPriceDollars: b.flatPriceCents ? (b.flatPriceCents / 100).toString() : "",
    freeItemsText: (b.freeItems ?? []).join(", "),
  };
}

const EMPTY_ROW: BannerFormRow = {
  eyebrow: "Limited Deal",
  titleLine1: "",
  titleLine2: "",
  description: "",
  strainLinesText: "",
  limitText: "",
  badgesText: "Quality BUDS, Free Delivery, Cash & e-Transfer",
  buttonLabel: "Shop Now",
  dealTag: "",
  strainCount: "",
  flatPriceDollars: "",
  freeItemsText: "",
};

export function DealBannersForm({ initial }: { initial: DealBanner[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [rows, setRows] = useState<BannerFormRow[]>(initial.length > 0 ? initial.map(toFormRow) : [EMPTY_ROW]);

  function update(i: number, field: keyof BannerFormRow, value: string) {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }

  function addRow() {
    setRows((rs) => [...rs, EMPTY_ROW]);
  }

  function removeRow(i: number) {
    setRows((rs) => rs.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const banners = rows.map((r) => ({
      eyebrow: r.eyebrow,
      titleLine1: r.titleLine1,
      titleLine2: r.titleLine2,
      description: r.description,
      strainLines: r.strainLinesText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      limitText: r.limitText,
      badges: r.badgesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      buttonLabel: r.buttonLabel,
      dealTag: r.dealTag,
      strainCount: parseInt(r.strainCount, 10) || 0,
      flatPriceCents: Math.round((parseFloat(r.flatPriceDollars) || 0) * 100),
      freeItems: r.freeItemsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
    startTransition(async () => {
      const result = await updateDealBanners(banners);
      if (result.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form className="admin-form admin-form-wide" onSubmit={handleSubmit}>
      {error && <p className="admin-error-banner">{error}</p>}
      {success && <p className="admin-success-banner">Deal banners saved.</p>}

      {rows.map((row, i) => (
        <div className="admin-subcard" key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <strong>Banner {i + 1}</strong>
            <button type="button" className="admin-btn danger" onClick={() => removeRow(i)}>
              Remove
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label>Eyebrow Label</label>
              <input value={row.eyebrow} onChange={(e) => update(i, "eyebrow", e.target.value)} />
            </div>
            <div>
              <label>Button Label</label>
              <input value={row.buttonLabel} onChange={(e) => update(i, "buttonLabel", e.target.value)} />
            </div>
            <div>
              <label>Title Line 1</label>
              <input placeholder="3oz for" value={row.titleLine1} onChange={(e) => update(i, "titleLine1", e.target.value)} />
            </div>
            <div>
              <label>Title Line 2</label>
              <input placeholder="$140" value={row.titleLine2} onChange={(e) => update(i, "titleLine2", e.target.value)} />
            </div>
          </div>
          <div>
            <label>Description</label>
            <input value={row.description} onChange={(e) => update(i, "description", e.target.value)} />
          </div>
          <div>
            <label>Strains Included (one line per group)</label>
            <textarea
              style={{ minHeight: 90 }}
              placeholder={"H: Zesty Citrus, Cookie Cream, Oreo\nI: Blueberry Kush, Rainbow Sherbet"}
              value={row.strainLinesText}
              onChange={(e) => update(i, "strainLinesText", e.target.value)}
            />
            <p className="field-hint">
              Format: a letter (S = Sativa, H = Hybrid, I = Indica), a colon, then strains separated by commas. One line per group.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label>Limit Text</label>
              <input placeholder="Limit 1oz per customer" value={row.limitText} onChange={(e) => update(i, "limitText", e.target.value)} />
            </div>
            <div>
              <label>Deal Tag</label>
              <input placeholder="deal3oz140" value={row.dealTag} onChange={(e) => update(i, "dealTag", e.target.value)} />
              <p className="field-hint">
                Products need this same tag (in ALL CAPS) added under their Tags field to show under this deal when clicked.
              </p>
            </div>
          </div>
          <div>
            <label>Badges (comma-separated)</label>
            <input value={row.badgesText} onChange={(e) => update(i, "badgesText", e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
            <div>
              <label>Strains to Pick</label>
              <input
                type="number"
                min="0"
                placeholder="3"
                value={row.strainCount}
                onChange={(e) => update(i, "strainCount", e.target.value)}
              />
            </div>
            <div>
              <label>Flat Bundle Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="140"
                value={row.flatPriceDollars}
                onChange={(e) => update(i, "flatPriceDollars", e.target.value)}
              />
            </div>
            <div>
              <label>Free Items (comma-separated)</label>
              <input
                placeholder="14g flower FREE, 6pc edible FREE"
                value={row.freeItemsText}
                onChange={(e) => update(i, "freeItemsText", e.target.value)}
              />
            </div>
          </div>
          <p className="field-hint">
            If &quot;Strains to Pick&quot; and &quot;Flat Bundle Price&quot; are both set, Shop Now opens a page
            where the customer picks that many strains from products tagged with this deal, then adds the whole
            bundle to their cart at the flat price. Leave both blank to just filter to the deal&apos;s products
            without a special price.
          </p>
        </div>
      ))}

      <button type="button" className="admin-btn secondary" onClick={addRow}>
        + Add Deal Banner
      </button>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn" disabled={isPending}>
          {isPending ? "Saving..." : "Save Deal Banners"}
        </button>
      </div>
    </form>
  );
}

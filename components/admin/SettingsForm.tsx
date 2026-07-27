"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateSiteSettings } from "@/app/actions/settings";

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    contact_phone: settings.contact_phone ?? "",
    contact_email: settings.contact_email ?? "",
    hours: settings.hours ?? "",
    service_area: settings.service_area ?? "Ontario, Canada",
    promotions_enabled: settings.promotions_enabled === "true",
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    startTransition(async () => {
      const result = await updateSiteSettings(form);
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
      {success && <p className="admin-success-banner">Settings saved.</p>}

      <div>
        <label>Contact Phone</label>
        <input value={form.contact_phone} onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))} />
      </div>
      <div>
        <label>Contact Email</label>
        <input value={form.contact_email} onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))} />
      </div>
      <div>
        <label>Hours</label>
        <textarea value={form.hours} onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))} placeholder="Mon-Sat: 10am-9pm&#10;Sun: 12pm-6pm" />
      </div>
      <div>
        <label>Service Area</label>
        <input value={form.service_area} onChange={(e) => setForm((f) => ({ ...f, service_area: e.target.value }))} />
      </div>
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="promotions_enabled"
          checked={form.promotions_enabled}
          onChange={(e) => setForm((f) => ({ ...f, promotions_enabled: e.target.checked }))}
        />
        <label htmlFor="promotions_enabled" style={{ marginBottom: 0 }}>
          Enable price promotions (SALE / compare-at pricing) storefront-wide
        </label>
      </div>
      <p className="field-hint">
        When off, SALE tags and strikethrough prices are hidden storefront-wide, even if set on a product.
      </p>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn" disabled={isPending}>
          {isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

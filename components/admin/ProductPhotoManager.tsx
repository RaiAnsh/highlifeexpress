"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addProductPhoto, deleteProductPhoto, setPrimaryPhoto } from "@/app/actions/products";

type Photo = { id: string; url: string; altText: string | null; isPrimary: boolean };

export function ProductPhotoManager({ productId, photos }: { productId: string; photos: Photo[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await addProductPhoto(productId, { url });
      if (result.ok) {
        setUrl("");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function handleDelete(photoId: string) {
    startTransition(async () => {
      await deleteProductPhoto(photoId, productId);
      router.refresh();
    });
  }

  function handleSetPrimary(photoId: string) {
    startTransition(async () => {
      await setPrimaryPhoto(photoId, productId);
      router.refresh();
    });
  }

  return (
    <div className="admin-card">
      <label>Photos</label>
      {photos.length === 0 && <p className="admin-empty" style={{ padding: "12px 0" }}>No photos yet.</p>}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        {photos.map((photo) => (
          <div key={photo.id} style={{ width: 120, textAlign: "center" }}>
            <img src={photo.url} alt={photo.altText ?? ""} style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, border: photo.isPrimary ? "2px solid var(--gold)" : "1px solid var(--border)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
              {!photo.isPrimary && (
                <button type="button" className="admin-btn secondary" style={{ fontSize: 11, padding: "4px 8px" }} onClick={() => handleSetPrimary(photo.id)} disabled={isPending}>
                  Set Primary
                </button>
              )}
              <button type="button" className="admin-btn danger" style={{ fontSize: 11, padding: "4px 8px" }} onClick={() => handleDelete(photo.id)} disabled={isPending}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Image URL (https://...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ flex: 1, minWidth: 240, padding: 10, border: "1px solid var(--border)", borderRadius: 8 }}
        />
        <button type="submit" className="admin-btn" disabled={isPending}>Add Photo</button>
      </form>
      {error && <p className="admin-error-banner" style={{ marginTop: 10 }}>{error}</p>}
      <p className="field-hint" style={{ marginTop: 10 }}>
        Paste a hosted image URL for now. Cloudinary direct-upload will replace this once the client's Cloudinary account is connected.
      </p>
    </div>
  );
}

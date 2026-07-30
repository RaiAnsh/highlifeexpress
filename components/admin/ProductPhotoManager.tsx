"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { uploadProductPhoto, deleteProductPhoto, setPrimaryPhoto } from "@/app/actions/products";

type Photo = { id: string; url: string; altText: string | null; isPrimary: boolean };

export function ProductPhotoManager({ productId, photos }: { productId: string; photos: Photo[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      const result = await uploadProductPhoto(productId, formData);
      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
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
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isPending}
        />
        {isPending && <span className="field-hint">Uploading...</span>}
      </div>
      {error && <p className="admin-error-banner" style={{ marginTop: 10 }}>{error}</p>}
      <p className="field-hint" style={{ marginTop: 10 }}>
        Choose a photo from your camera roll or files — it uploads straight to Cloudinary.
      </p>
    </div>
  );
}

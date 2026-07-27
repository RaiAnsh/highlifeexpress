"use client";

import { useState, useTransition } from "react";
import { useSite } from "@/lib/site-context";
import { createReservation } from "@/app/actions/reservations";

export function ReservationModal() {
  const { isReservationOpen, closeReservationModal, cart, clearCart } = useSite();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [ageAttested, setAgeAttested] = useState(false);

  if (!isReservationOpen) return null;

  function handleClose() {
    setError(null);
    setSuccess(false);
    setAgeAttested(false);
    closeReservationModal();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createReservation({
        customerName: form.get("customerName"),
        phone: form.get("phone"),
        email: form.get("email") || undefined,
        preferredContact: form.get("preferredContact") || undefined,
        notes: form.get("notes") || undefined,
        ageAttested,
        items: cart.map((i) => ({
          productId: i.productId,
          name: i.name,
          priceLabel: i.priceLabel,
          unitPriceCents: i.unitPriceCents,
          qty: i.qty,
        })),
      });
      if (result.ok) {
        setSuccess(true);
        clearCart();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="reservation-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="reservation-modal">
        {success ? (
          <div className="reservation-success">
            <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
            <h3>Reservation received!</h3>
            <p>
              We&apos;ll contact you shortly to confirm your order for in-store pickup. No payment
              is taken online &mdash; all payment happens in person at pickup.
            </p>
            <button className="reservation-submit-btn" onClick={handleClose}>Close</button>
          </div>
        ) : (
          <>
            <h3>Request Reservation</h3>
            <p className="reservation-subtitle">
              This reserves your items for in-store pickup &mdash; no payment is taken online.
              We&apos;ll reach out to confirm details and timing.
            </p>
            <form className="reservation-form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="customerName">Full name</label>
                <input id="customerName" name="customerName" type="text" required />
              </div>
              <div>
                <label htmlFor="phone">Phone number</label>
                <input id="phone" name="phone" type="tel" required />
              </div>
              <div>
                <label htmlFor="email">Email (optional)</label>
                <input id="email" name="email" type="email" />
              </div>
              <div>
                <label htmlFor="preferredContact">Preferred contact method</label>
                <select id="preferredContact" name="preferredContact" defaultValue="Phone call">
                  <option>Phone call</option>
                  <option>Text message</option>
                  <option>Email</option>
                </select>
              </div>
              <div>
                <label htmlFor="notes">Notes (optional)</label>
                <textarea id="notes" name="notes" placeholder="Anything else we should know?" />
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontWeight: 400 }}>
                <input
                  type="checkbox"
                  checked={ageAttested}
                  onChange={(e) => setAgeAttested(e.target.checked)}
                  style={{ width: "auto", marginTop: 3 }}
                  required
                />
                I confirm I am 19 years of age or older and located in Ontario, Canada.
              </label>
              {error && <p className="reservation-error">{error}</p>}
              <div className="reservation-form-actions">
                <button type="button" className="reservation-cancel-btn" onClick={handleClose}>Cancel</button>
                <button type="submit" className="reservation-submit-btn" disabled={isPending || cart.length === 0}>
                  {isPending ? "Submitting..." : "Submit Reservation"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

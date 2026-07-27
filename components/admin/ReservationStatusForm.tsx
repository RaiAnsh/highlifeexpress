"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateReservationStatus } from "@/app/actions/admin-reservations";

const STATUSES = ["NEW", "CONFIRMED", "READY_FOR_PICKUP", "COMPLETED", "CANCELLED"] as const;

export function ReservationStatusForm({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(newStatus: string) {
    startTransition(async () => {
      await updateReservationStatus(id, newStatus);
      router.refresh();
    });
  }

  return (
    <select value={status} disabled={isPending} onChange={(e) => handleChange(e.target.value)} style={{ padding: 10, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}>
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
      ))}
    </select>
  );
}

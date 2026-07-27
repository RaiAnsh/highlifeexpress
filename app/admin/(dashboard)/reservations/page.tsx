import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONFIRMED: "Confirmed",
  READY_FOR_PICKUP: "Ready for Pickup",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Reservations</h1>
          <p>{reservations.length} reservation{reservations.length === 1 ? "" : "s"} total.</p>
        </div>
      </div>

      <div className="admin-card">
        {reservations.length === 0 ? (
          <p className="admin-empty">No reservations yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Subtotal</th>
                <th>Status</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td>{r.customerName}</td>
                  <td>{r.phone}</td>
                  <td>{r.items.reduce((sum, i) => sum + i.qty, 0)}</td>
                  <td>${(r.subtotalCents / 100).toFixed(2)}</td>
                  <td>
                    <span className={`admin-badge status-${r.status.toLowerCase()}`}>{STATUS_LABELS[r.status]}</span>
                  </td>
                  <td>{r.createdAt.toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" })}</td>
                  <td className="actions">
                    <Link className="admin-btn secondary" href={`/admin/reservations/${r.id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

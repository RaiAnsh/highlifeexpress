import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReservationStatusForm } from "@/components/admin/ReservationStatusForm";
import { formatTorontoDateTime } from "@/lib/format-date";

export const dynamic = "force-dynamic";

export default async function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reservation = await prisma.reservation.findUnique({ where: { id }, include: { items: true } });
  if (!reservation) notFound();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Reservation — {reservation.customerName}</h1>
          <p>Submitted {formatTorontoDateTime(reservation.createdAt)}</p>
        </div>
        <ReservationStatusForm id={reservation.id} status={reservation.status} />
      </div>

      <div className="admin-card">
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--purple)", marginBottom: 14 }}>Customer</h2>
        <p><strong>Name:</strong> {reservation.customerName}</p>
        <p><strong>Delivery address:</strong> {reservation.deliveryAddress || "\u2014"}</p>
        <p><strong>Phone:</strong> {reservation.phone}</p>
        {reservation.email && <p><strong>Email:</strong> {reservation.email}</p>}
        {reservation.preferredContact && <p><strong>Preferred contact:</strong> {reservation.preferredContact}</p>}
        {reservation.notes && <p><strong>Notes:</strong> {reservation.notes}</p>}
      </div>

      <div className="admin-card">
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--purple)", marginBottom: 14 }}>Items</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Option</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>
            {reservation.items.map((item) => (
              <tr key={item.id}>
                <td>{item.productNameSnap}</td>
                <td>{item.priceLabelSnap}</td>
                <td>{item.qty}</td>
                <td>${(item.unitPriceCentsSnap / 100).toFixed(2)}</td>
                <td>${((item.unitPriceCentsSnap * item.qty) / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 14, fontWeight: 700 }}>Subtotal: ${(reservation.subtotalCents / 100).toFixed(2)}</p>
      </div>

      <div className="admin-card">
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--purple)", marginBottom: 14 }}>Compliance Audit</h2>
        <p><strong>Age attested (19+):</strong> {reservation.ageAttested ? "Yes" : "No"}</p>
        <p><strong>Location attested (Ontario):</strong> {reservation.locationAttested ? "Yes" : "No"}</p>
        {reservation.ipAddress && <p><strong>IP address:</strong> {reservation.ipAddress}</p>}
        {reservation.ipCountry && <p><strong>IP country:</strong> {reservation.ipCountry}</p>}
        {reservation.ipRegion && <p><strong>IP region:</strong> {reservation.ipRegion}</p>}
      </div>
    </>
  );
}

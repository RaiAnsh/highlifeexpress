import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productCount, activeProductCount, newReservationCount, unhandledMessageCount] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.reservation.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count({ where: { handled: false } }),
  ]);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your catalog and incoming requests.</p>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="num">{activeProductCount}</div>
          <div className="label">Active Products ({productCount} total)</div>
        </div>
        <div className="admin-stat-card">
          <div className="num">{newReservationCount}</div>
          <div className="label">New Reservations</div>
        </div>
        <div className="admin-stat-card">
          <div className="num">{unhandledMessageCount}</div>
          <div className="label">Unread Contact Messages</div>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--purple)", marginBottom: 12 }}>
          Quick Links
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="admin-btn" href="/admin/products/new">+ Add Product</Link>
          <Link className="admin-btn secondary" href="/admin/reservations">View Reservations</Link>
          <Link className="admin-btn secondary" href="/admin/settings">Site Settings</Link>
        </div>
      </div>
    </>
  );
}

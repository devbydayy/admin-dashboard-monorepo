"use client";

import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Edit } from "lucide-react";
import Link from "next/link";

const mockCustomers: Record<string, any> = {
  "1": {
    id: "1",
    name: "Esther Howard",
    email: "esther.howard@email.com",
    phone: "+1 234 567 890",
    address: "123 Main St, Springfield, IL 62701",
    createdAt: "Jan 15, 2023",
    orders: 12,
    totalSpent: 2455.00,
    lastActive: "May 18, 2024",
    recentOrders: [
      { id: "#ORD-7845", amount: 245.00,  status: "Delivered",  date: "May 18, 2024" },
      { id: "#ORD-7820", amount: 89.99,   status: "Completed",  date: "May 10, 2024" },
      { id: "#ORD-7801", amount: 349.50,  status: "Completed",  date: "Apr 28, 2024" },
    ],
  },
};

const statusBadgeClass: Record<string, string> = {
  Delivered: "sa-badge-delivered",
  Completed: "sa-badge-completed",
  Shipped: "sa-badge-shipped",
  Cancelled: "sa-badge-cancelled",
  Pending: "sa-badge-pending",
};

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = mockCustomers[params.id] ?? mockCustomers["1"];

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "72rem", margin: "0 auto" }}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <Link
            href="/customers"
            className="p-2 rounded-circle"
            style={{
              transition: "background-color 0.15s",
              color: "var(--sa-text-secondary)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sa-slate-100)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="fw-bold mb-0" style={{ fontSize: "1.5rem", color: "var(--sa-text-primary)" }}>
            Customer Details
          </h1>
        </div>
        <button className="btn btn-indigo d-inline-flex align-items-center gap-2">
          <Edit size={16} /> Edit Customer
        </button>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div
            className="card"
            style={{
              backgroundColor: "var(--sa-card-bg)",
              border: "1px solid var(--sa-slate-200)",
              borderRadius: "0.75rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div className="card-body" style={{ padding: "1.5rem", textAlign: "center" }}>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: "var(--sa-indigo-100)",
                  color: "var(--sa-indigo)",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                {customer.name.charAt(0)}
              </div>
              <h5 className="fw-semibold mb-0" style={{ color: "var(--sa-text-primary)" }}>
                {customer.name}
              </h5>
              <p className="text-muted small mb-4">Customer since {customer.createdAt}</p>

              <hr style={{ borderColor: "var(--sa-slate-200)" }} />

              <div className="d-flex flex-column gap-2 text-start">
                <div className="d-flex align-items-center gap-2 small">
                  <Mail size={16} style={{ color: "var(--sa-text-muted)", flexShrink: 0 }} />
                  <span className="text-truncate" style={{ color: "var(--sa-text-secondary)" }}>
                    {customer.email}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2 small">
                  <Phone size={16} style={{ color: "var(--sa-text-muted)", flexShrink: 0 }} />
                  <span style={{ color: "var(--sa-text-secondary)" }}>{customer.phone}</span>
                </div>
                <div className="d-flex align-items-start gap-2 small">
                  <MapPin size={16} style={{ color: "var(--sa-text-muted)", flexShrink: 0, marginTop: "0.125rem" }} />
                  <span style={{ color: "var(--sa-text-secondary)" }}>{customer.address}</span>
                </div>
              </div>

              <hr style={{ borderColor: "var(--sa-slate-200)" }} />

              <div className="row g-2">
                <div className="col-6">
                  <div
                    className="rounded-2 p-2"
                    style={{
                      backgroundColor: "var(--sa-slate-50)",
                    }}
                  >
                    <p className="text-muted small mb-1">Orders</p>
                    <p className="fw-bold mb-0 fs-5" style={{ color: "var(--sa-text-primary)" }}>
                      {customer.orders}
                    </p>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="rounded-2 p-2"
                    style={{
                      backgroundColor: "var(--sa-slate-50)",
                    }}
                  >
                    <p className="text-muted small mb-1">Spent</p>
                    <p className="fw-bold mb-0 fs-5" style={{ color: "var(--sa-text-primary)" }}>
                      ${customer.totalSpent.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-8">
          <div
            className="card"
            style={{
              backgroundColor: "var(--sa-card-bg)",
              border: "1px solid var(--sa-slate-200)",
              borderRadius: "0.75rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div className="card-body" style={{ padding: "1.5rem" }}>
              <div className="d-flex align-items-center gap-2 mb-4">
                <ShoppingBag size={20} style={{ color: "var(--sa-indigo)" }} />
                <h5 className="fw-semibold mb-0" style={{ color: "var(--sa-text-primary)" }}>
                  Recent Orders
                </h5>
              </div>

              <div className="table-responsive">
                <table className="w-100" style={{ fontSize: "0.875rem", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--sa-slate-200)", color: "var(--sa-text-secondary)" }}>
                      <th className="fw-medium pb-3 text-start">Order ID</th>
                      <th className="fw-medium pb-3 text-start">Amount</th>
                      <th className="fw-medium pb-3 text-start">Status</th>
                      <th className="fw-medium pb-3 text-start">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.recentOrders.map((o: any) => (
                      <tr
                        key={o.id}
                        style={{ borderTop: "1px solid var(--sa-slate-200)", transition: "background-color 0.12s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(203, 213, 225, 0.25)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <td className="py-3">
                          <Link
                            href={`/orders/${o.id}`}
                            className="sa-order-link"
                            style={{ fontSize: "0.875rem" }}
                          >
                            {o.id}
                          </Link>
                        </td>
                        <td className="py-3" style={{ color: "var(--sa-text-primary)" }}>
                          ${o.amount.toFixed(2)}
                        </td>
                        <td className="py-3">
                          <span
                            className={`sa-badge ${statusBadgeClass[o.status] || "sa-badge-pending"}`}
                            style={{
                              padding: "0.25rem 0.625rem",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              borderRadius: "999px",
                            }}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3" style={{ color: "var(--sa-text-muted)", fontSize: "0.8125rem" }}>
                          {o.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
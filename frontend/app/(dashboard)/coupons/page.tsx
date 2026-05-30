"use client"

import { Plus, Edit, Trash2, Tag } from "lucide-react"

const mockCoupons = [
  { id: "1", code: "SUMMER20", discount: "20%", type: "Percentage", used: 142, limit: 500, expiry: "Jun 30, 2024", status: "Active" },
  { id: "2", code: "FLAT10",   discount: "$10",  type: "Fixed",      used: 89,  limit: 200, expiry: "May 31, 2024", status: "Active" },
  { id: "3", code: "VIP50",    discount: "50%", type: "Percentage", used: 50,  limit: 50,  expiry: "Dec 31, 2024", status: "Exhausted" },
  { id: "4", code: "WELCOME",  discount: "15%", type: "Percentage", used: 310, limit: 1000, expiry: "Jan 01, 2025", status: "Active" },
]

const statusColors: Record<string, string> = {
  Active:    "sa-badge-completed",
  Exhausted: "sa-badge-cancelled",
  Expired:   "sa-badge-pending",
}

export default function CouponsPage() {
  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <button
          className="btn d-inline-flex align-items-center gap-2"
          style={{
            backgroundColor: "var(--sa-indigo)",
            borderColor: "var(--sa-indigo)",
            color: "#fff",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            padding: "0.5rem 1rem",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--sa-indigo)")}
        >
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div
        style={{
          backgroundColor: "var(--sa-card-bg)",
          border: "1px solid var(--sa-slate-200)",
          borderRadius: "0.75rem",
          overflow: "hidden",
        }}
      >
        <div className="table-responsive">
          <table
            className="w-100 text-nowrap"
            style={{ fontSize: "0.875rem", borderCollapse: "collapse" }}
          >
            <thead
              style={{
                backgroundColor: "var(--sa-slate-50)",
                borderBottom: "1px solid var(--sa-slate-200)",
                color: "var(--sa-text-secondary)",
              }}
            >
              <tr>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Code</th>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Discount</th>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Type</th>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Used / Limit</th>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Expiry</th>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Status</th>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCoupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  style={{
                    borderTop: "1px solid var(--sa-slate-200)",
                    transition: "background-color 0.12s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(203, 213, 225, 0.25)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div className="d-flex align-items-center gap-2">
                      <Tag size={14} style={{ color: "var(--sa-indigo)" }} />
                      <span className="fw-semibold font-monospace" style={{ color: "var(--sa-text-primary)" }}>
                        {coupon.code}
                      </span>
                    </div>
                  </td>
                  <td className="fw-medium" style={{ padding: "1rem 1.5rem", color: "var(--sa-text-primary)" }}>
                    {coupon.discount}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--sa-text-secondary)" }}>
                    {coupon.type}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--sa-text-secondary)" }}>
                    {coupon.used} / {coupon.limit}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--sa-text-secondary)" }}>
                    {coupon.expiry}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span
                      className={`sa-badge ${statusColors[coupon.status] || "sa-badge-pending"}`}
                      style={{
                        padding: "0.25rem 0.625rem",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        borderRadius: "999px",
                      }}
                    >
                      {coupon.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div className="d-flex gap-3">
                      <button
                        className="btn btn-ghost p-0 border-0"
                        style={{ color: "var(--sa-text-muted)", transition: "color 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sa-indigo)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sa-text-muted)")}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-ghost p-0 border-0"
                        style={{ color: "var(--sa-text-muted)", transition: "color 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#dc3545")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sa-text-muted)")}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
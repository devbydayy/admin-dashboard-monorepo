"use client";

import Link from "next/link";
import type { RecentOrderSummary } from "@/types/analytics.types";

interface RecentOrdersProps {
  orders: RecentOrderSummary[];
  loading?: boolean;
}

const DEMO_ORDERS: RecentOrderSummary[] = [
  { id: "1", orderNumber: "#ORD-7845", customer: { name: "Esther Howard"      }, total: 245.00,   status: "DELIVERED",  createdAt: "2024-05-18" },
  { id: "2", orderNumber: "#ORD-7844", customer: { name: "Cameron Williamson" }, total: 1245.50,  status: "PROCESSING", createdAt: "2024-05-18" },
  { id: "3", orderNumber: "#ORD-7843", customer: { name: "Brooklyn Simmons"   }, total: 89.99,    status: "SHIPPED",    createdAt: "2024-05-17" },
  { id: "4", orderNumber: "#ORD-7842", customer: { name: "Leslie Alexander"   }, total: 549.00,   status: "DELIVERED",  createdAt: "2024-05-17" },
  { id: "5", orderNumber: "#ORD-7841", customer: { name: "Dianne Russell"     }, total: 349.50,   status: "CANCELLED",  createdAt: "2024-05-16" },
];

const statusClass: Record<string, string> = {
  DELIVERED:  "sa-badge-delivered",
  COMPLETED:  "sa-badge-completed",
  PROCESSING: "sa-badge-processing",
  PAID:       "sa-badge-paid",
  SHIPPED:    "sa-badge-shipped",
  CANCELLED:  "sa-badge-cancelled",
  PENDING:    "sa-badge-pending",
};

const avatarColors = [
  "#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444",
];

function shortOrderNumber(full: string): string {
  const match = full.match(/ORD-(\d{1,4})/);
  if (match) return "#" + match[1];
  return full;
}

export default function RecentOrders({ orders, loading }: RecentOrdersProps) {
  const displayOrders = orders && orders.length > 0 ? orders : DEMO_ORDERS;

  if (loading) {
    return (
      <div className="sa-card" style={{ flex: 1, padding: "16px 18px" }}>
        <div
          className="sa-skeleton"
          style={{
            width: "100%",
            height: "100%",
            minHeight: 260,
            borderRadius: 8,
          }}
        />
      </div>
    );
  }

  return (
    <div className="sa-card" style={{ flex: 1, padding: "16px 18px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <span className="sa-chart-title" style={{ fontSize: "0.85rem" }}>Recent Orders</span>
        <Link href="/orders" className="sa-view-all" style={{ fontSize: "0.75rem" }}>View all</Link>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="sa-table" style={{ fontSize: "0.8rem" }}>
          <thead>
            <tr>
              <th style={{ paddingBottom: 8 }}>Order ID</th>
              <th style={{ paddingBottom: 8 }}>Customer</th>
              <th style={{ paddingBottom: 8 }}>Amount</th>
              <th style={{ paddingBottom: 8 }}>Status</th>
              <th style={{ paddingBottom: 8 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.map((order, idx) => (
              <tr key={order.id}>
                <td style={{ padding: "13px 0", paddingRight: 14 }}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="sa-order-link"
                    style={{ fontSize: "0.8rem" }}
                  >
                    {shortOrderNumber(order.orderNumber)}
                  </Link>
                </td>
                <td style={{ padding: "6px 0", paddingRight: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div
                      className="sa-customer-avatar"
                      style={{
                        width: 24,
                        height: 24,
                        fontSize: "0.65rem",
                        backgroundColor: avatarColors[idx % avatarColors.length] + "22",
                        color: avatarColors[idx % avatarColors.length],
                      }}
                    >
                      {order.customer?.name?.charAt(0) || "?"}
                    </div>
                    <span style={{ fontWeight: 500, fontSize: "0.8rem", color: "var(--sa-text-primary)" }}>
                      {order.customer?.name || "Unknown"}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "6px 0", paddingRight: 14, color: "var(--sa-text-secondary)", fontWeight: 500, fontSize: "0.75rem" }}>
                  ${order.total.toFixed(2)}
                </td>
                <td style={{ padding: "6px 0", paddingRight: 14 }}>
                  <span className={`sa-badge ${statusClass[order.status] ?? "sa-badge-pending"}`} style={{ fontSize: "0.65rem", padding: "2px 8px" }}>
                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </span>
                </td>
                <td style={{ padding: "6px 0", color: "var(--sa-text-muted)", fontSize: "0.75rem" }}>
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
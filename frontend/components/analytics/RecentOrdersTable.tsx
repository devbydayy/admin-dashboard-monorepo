import Link from "next/link";
import type { RecentOrderSummary } from "@/types/analytics.types";

interface RecentOrdersTableProps {
  orders: RecentOrderSummary[];
}

const avatarColors = ["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444"];
const STATUS_CLASS: Record<string, string> = {
  DELIVERED: "sa-badge-delivered",
  COMPLETED: "sa-badge-completed",
  PROCESSING: "sa-badge-processing",
  PAID: "sa-badge-paid",
  SHIPPED: "sa-badge-shipped",
  CANCELLED: "sa-badge-cancelled",
  PENDING: "sa-badge-pending",
};

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const isEmpty = !orders?.length;

  return (
    <div className="sa-card" style={{ flex: 1, padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span className="sa-chart-title" style={{ fontSize: "0.85rem" }}>Recent Orders</span>
        <Link href="/orders" className="sa-view-all" style={{ fontSize: "0.75rem" }}>View All</Link>
      </div>
      <table className="sa-analytics-table" style={{ fontSize: "0.75rem", tableLayout: "auto", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "6px 6px", width: "1%" }}>Order ID</th>
            <th style={{ textAlign: "left", padding: "6px 6px" }}>Customer</th>
            <th style={{ padding: "6px 5px", whiteSpace: "nowrap" }}>Amount</th>
            <th style={{ padding: "6px 7px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "20px 8px", color: "var(--sa-text-muted)" }}>
                No recent orders.
              </td>
            </tr>
          ) : (
            orders.map((order, idx) => (
              <tr key={order.id}>
                <td style={{ padding: "7px 5px" }}>
                  <Link href={`/orders/${order.id}`} className="sa-order-link" style={{ fontSize: "0.725rem" }}>
                    {order.orderNumber}
                  </Link>
                </td>
                <td style={{ padding: "9px 6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="sa-customer-avatar"
                      style={{
                        backgroundColor: avatarColors[idx % avatarColors.length] + "22",
                        color: avatarColors[idx % avatarColors.length],
                        width: 22, height: 22, fontSize: "0.6rem", flexShrink: 0,
                      }}>
                      {order.customer?.name?.charAt(0) || "?"}
                    </div>
                    <span style={{
                      fontWeight: 500, fontSize: "0.75rem", color: "var(--sa-text-primary)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      maxWidth: "100px",
                    }}>
                      {order.customer?.name || "Unknown"}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "6px 6px", color: "var(--sa-text-secondary)", fontWeight: 500, fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                  ${order.total.toFixed(2)}
                </td>
                <td style={{ padding: "6px 6px", textAlign: "right" }}>
                  <span className={`sa-badge ${STATUS_CLASS[order.status] ?? "sa-badge-pending"}`}
                    style={{ padding: "2px 6px", fontSize: "0.65rem" }}>
                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
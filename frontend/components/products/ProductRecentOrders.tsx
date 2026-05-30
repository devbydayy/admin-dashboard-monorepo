import Link from "next/link";

const demoOrders = [
  { id: "1", num: "#ORD-7845", date: "May 18, 2024", customer: "Esther Howard", qty: 2, total: 258.0, status: "DELIVERED" },
  { id: "2", num: "#ORD-7842", date: "May 17, 2024", customer: "Cameron Williamson", qty: 1, total: 129.0, status: "SHIPPED" },
  { id: "3", num: "#ORD-7839", date: "May 16, 2024", customer: "Brooklyn Simmons", qty: 1, total: 129.0, status: "DELIVERED" },
];

const statusClassMap: Record<string, string> = {
  DELIVERED: "sa-badge-delivered",
  SHIPPED: "sa-badge-shipped",
};

export function ProductRecentOrders() {
  return (
    <div className="sa-card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span className="sa-chart-title">Recent Orders</span>
        <Link href="/orders" className="sa-view-all">View All</Link>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="sa-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {demoOrders.map((o) => (
              <tr key={o.id}>
                <td><Link href={`/orders/${o.id}`} className="sa-order-link">{o.num}</Link></td>
                <td style={{ color: "var(--sa-text-muted)" }}>{o.date}</td>
                <td style={{ color: "var(--sa-text-primary)", fontWeight: 500 }}>{o.customer}</td>
                <td style={{ color: "var(--sa-text-secondary)" }}>{o.qty}</td>
                <td style={{ color: "var(--sa-text-secondary)", fontWeight: 500 }}>${o.total.toFixed(2)}</td>
                <td><span className={`sa-badge ${statusClassMap[o.status] ?? "sa-badge-pending"}`}>{o.status.charAt(0) + o.status.slice(1).toLowerCase()}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
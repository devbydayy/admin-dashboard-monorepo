import { Eye, ShoppingBag, TrendingUp, BarChart2, ChevronDown } from "lucide-react";

export function ProductPerformance({ product }: { product: any }) {
  const revenue = (product.salePrice ?? product.price) * (product.reviewCount ?? 128);
  return (
    <div className="sa-card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span className="sa-chart-title">Product Performance</span>
        <button className="sa-dropdown-btn">Last 30 Days <ChevronDown size={13} style={{ marginLeft: 2 }} /></button>
      </div>
      <div className="row g-3">
        {[
          { icon: <Eye size={18} color="var(--sa-indigo)" />, iconBg: "var(--sa-indigo-100)", label: "Views", value: (product.views ?? 1245).toLocaleString(), trend: "+12.5%" },
          { icon: <ShoppingBag size={18} color="var(--sa-blue)" />, iconBg: "var(--sa-blue-100)", label: "Units Sold", value: (product.reviewCount ?? 128).toLocaleString(), trend: "+8.3%" },
          { icon: <TrendingUp size={18} color="var(--sa-green)" />, iconBg: "var(--sa-green-100)", label: "Revenue", value: `$${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, trend: "+15.6%" },
          { icon: <BarChart2 size={18} color="var(--sa-rose)" />, iconBg: "var(--sa-rose-100)", label: "Conversion Rate", value: "10.3%", trend: "+6.2%" },
        ].map((stat, idx) => (
          <div key={idx} className="col-6">
            <div className="sa-perf-card">
              <div className="sa-stat-icon" style={{ backgroundColor: stat.iconBg, width: 36, height: 36, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--sa-text-muted)" }}>{stat.label}</div>
              <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--sa-text-primary)", margin: "2px 0" }}>{stat.value}</div>
              <div className="sa-trend-up" style={{ fontSize: "0.75rem" }}>↑ {stat.trend}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
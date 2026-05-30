import { Package, ShoppingBag, AlertTriangle, BarChart2, Eye, Star, ChevronDown } from "lucide-react";
import { Stars } from "./Stars";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface Props {
  product: any;
  isEditing: boolean;
  form: any;
  setField: any;
}

export function ProductSidebar({ product, isEditing, form, setField }: Props) {
  const p = isEditing ? form : product;

  return (
    <div className="sa-card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--sa-card-border)" }}>
        <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--sa-text-primary)" }}>Status</span>
        {isEditing ? (
          <select
            className="sa-form-control"
            style={{ width: "auto" }}
            value={form.status ?? "ACTIVE"}
            onChange={(e) => setField("status", e.target.value)}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", border: "1px solid var(--sa-card-border)", borderRadius: 20, fontSize: "0.8125rem", cursor: "default", color: "var(--sa-text-primary)" }}>
            <StatusBadge status={product.status} />
            <ChevronDown size={13} color="var(--sa-text-muted)" />
          </div>
        )}
      </div>

      {[
        { icon: <Package size={15} />, label: "Stock Quantity", value: `${p?.stock ?? 0} units` },
        { icon: <ShoppingBag size={15} />, label: "Sold", value: `${(p?.views ?? 128)} units` },
        { icon: <AlertTriangle size={15} />, label: "Low Stock Threshold", value: `${p?.lowStockThreshold ?? 20} units` },
        { icon: <BarChart2 size={15} />, label: "Total Revenue", value: `$${((p?.salePrice ?? p?.price ?? 0) * (p?.views ?? 128)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { icon: <Eye size={15} />, label: "Views", value: (p?.views ?? 1245).toLocaleString() },
        { icon: <Star size={15} />, label: "Avg. Rating", value: <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Stars rating={p?.avgRating ?? 4.5} size={13} /><span style={{ fontWeight: 600 }}>{(p?.avgRating ?? 4.6).toFixed(1)}</span></span> },
      ].map((stat, idx) => (
        <div key={idx} className="sa-product-stat-row">
          <span className="sa-product-stat-label">
            <span style={{ color: "var(--sa-text-muted)" }}>{stat.icon}</span>
            {stat.label}
          </span>
          <span className="sa-product-stat-value">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
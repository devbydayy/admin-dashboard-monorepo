import Link from "next/link";
import ProductImage from "@/components/ui/ProductImage";
import type { TopProductItem } from "@/types/analytics.types"

interface TopProductsTableProps {
  products: TopProductItem[];
}

export default function TopProductsTable({ products }: TopProductsTableProps) {
  const isEmpty = !products?.length;

  return (
    <div className="sa-card" style={{ flex: 1, padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span className="sa-chart-title" style={{ fontSize: "0.85rem" }}>Top Products</span>
        <Link href="/products" className="sa-view-all" style={{ fontSize: "0.75rem" }}>View All</Link>
      </div>
      <table className="sa-analytics-table" style={{ fontSize: "0.75rem", tableLayout: "auto", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px 8px" }}>Product</th>
            <th style={{ padding: "8px 8px" }}>Sold</th>
            <th style={{ padding: "8px 8px" }}>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "20px 8px", color: "var(--sa-text-muted)" }}>
                No product data available.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.productId}>
                <td style={{ padding: "8px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ProductImage src={p.image} alt={p.name} size={30} />
                    <span style={{
                      fontWeight: 500, fontSize: "0.75rem", color: "var(--sa-text-primary)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      maxWidth: 100, display: "block",
                    }}>
                      {p.name}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "6px 8px", color: "var(--sa-text-secondary)", fontWeight: 500, fontSize: "0.75rem" }}>
                  {p.quantitySold}
                </td>
                <td style={{ padding: "6px 8px", fontWeight: 600, color: "var(--sa-text-primary)", fontSize: "0.75rem" }}>
                  ${((p.price ?? 0) * (p.quantitySold ?? 0)).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
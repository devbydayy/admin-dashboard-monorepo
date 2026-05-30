import { CheckCircle2, Edit2 } from "lucide-react";
import { Stars } from "./Stars";

interface Props {
  product: any;
  isEditing: boolean;
  form: any;
  setField: any;
  parseFeatures: (raw?: string | null) => string[];
  discountPct: number;
  stockPct: number;
  stockMax: number;
}

export function ProductOverviewTab({
  product,
  isEditing,
  form,
  setField,
  parseFeatures,
  discountPct,
  stockPct,
  stockMax,
}: Props) {
  const features = parseFeatures(product.features);

  return (
    <div className="row g-4 align-items-start">
      <div className="col-12 col-xl-4">
        <div className="sa-card" style={{ height: "100%" }}>
          <h3 style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--sa-text-primary)", marginBottom: 12 }}>
            Product Description
          </h3>
          {isEditing ? (
            <textarea
              className="sa-form-control"
              rows={5}
              value={form.description ?? ""}
              onChange={(e) => setField("description", e.target.value)}
            />
          ) : (
            <>
              <p style={{ fontSize: "0.875rem", color: "var(--sa-text-secondary)", lineHeight: 1.65, marginBottom: features.length ? 14 : 0 }}>
                {product.description ?? "No description provided."}
              </p>
              {features.length > 0 && (
                <ul className="sa-feature-list">
                  {features.map((f: string, i: number) => (
                    <li key={i}>
                      <span className="sa-feature-check"><CheckCircle2 size={11} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      <div className="col-12 col-xl-4">
        <div className="sa-card" style={{ height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h3 style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--sa-text-primary)", margin: 0 }}>
              Pricing Summary
            </h3>
            {!isEditing && (
              <button className="sa-btn-outline" style={{ padding: "4px 10px", fontSize: "0.75rem" }} onClick={() => {}}>
                Edit
              </button>
            )}
          </div>
          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="row g-2">
                <div className="col-6">
                  <label className="sa-form-label">Regular Price</label>
                  <input type="number" step="0.01" className="sa-form-control" value={form.price ?? ""} onChange={(e) => setField("price", parseFloat(e.target.value))} />
                </div>
                <div className="col-6">
                  <label className="sa-form-label">Sale Price</label>
                  <input type="number" step="0.01" className="sa-form-control" value={form.salePrice ?? ""} onChange={(e) => setField("salePrice", e.target.value ? parseFloat(e.target.value) : null)} />
                </div>
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <label className="sa-form-label">Tax Class</label>
                  <select className="sa-form-control" value={form.taxClass ?? "Standard"} onChange={(e) => setField("taxClass", e.target.value)}>
                    <option>Standard</option>
                    <option>Reduced</option>
                    <option>Zero</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="sa-form-label">Tax Rate (%)</label>
                  <input type="number" step="0.1" className="sa-form-control" value={form.taxRate ?? ""} onChange={(e) => setField("taxRate", parseFloat(e.target.value))} />
                </div>
              </div>
            </div>
          ) : (
            <>
              <table className="sa-price-table">
                <tbody>
                  <tr><td className="sa-price-label">Regular Price</td><td>${(product.price ?? 0).toFixed(2)}</td></tr>
                  <tr><td className="sa-price-label">Sale Price</td><td style={{ color: "var(--sa-indigo)", fontWeight: 600 }}>${(product.salePrice ?? product.price ?? 0).toFixed(2)}</td></tr>
                  <tr><td className="sa-price-label">Discount</td><td>{discountPct}%</td></tr>
                  <tr><td className="sa-price-label">Tax Class</td><td>{product.taxClass ?? "Standard"}</td></tr>
                  <tr><td className="sa-price-label">Tax Rate</td><td>{product.taxRate ?? 10}%</td></tr>
                </tbody>
              </table>
              <div className="sa-price-final-row">
                <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--sa-text-primary)" }}>Final Price</span>
                <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--sa-text-primary)" }}>${(product.salePrice ?? product.price ?? 0).toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="col-12 col-xl-4">
        <div className="sa-card" style={{ height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h3 style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--sa-text-primary)", margin: 0 }}>
              Stock Information
            </h3>
            {!isEditing && (
              <button className="sa-btn-outline" style={{ padding: "4px 10px", fontSize: "0.75rem" }} onClick={() => {}}>
                Edit
              </button>
            )}
          </div>
          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="row g-2">
                <div className="col-6">
                  <label className="sa-form-label">Stock Qty</label>
                  <input type="number" className="sa-form-control" value={form.stock ?? 0} onChange={(e) => setField("stock", parseInt(e.target.value))} />
                </div>
                <div className="col-6">
                  <label className="sa-form-label">Low Stock Alert</label>
                  <input type="number" className="sa-form-control" value={form.lowStockThreshold ?? 10} onChange={(e) => setField("lowStockThreshold", parseInt(e.target.value))} />
                </div>
              </div>
              <div>
                <label className="sa-form-label">Warehouse</label>
                <input type="text" className="sa-form-control" value={form.warehouse ?? ""} onChange={(e) => setField("warehouse", e.target.value)} placeholder="e.g. Main Warehouse" />
              </div>
              <div>
                <label className="sa-form-label">Location</label>
                <input type="text" className="sa-form-control" value={form.warehouseLocation ?? ""} onChange={(e) => setField("warehouseLocation", e.target.value)} placeholder="e.g. Aisle 3, Shelf 2" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <input type="checkbox" id="lowStockAlert" checked={form.lowStockAlertEnabled ?? true} onChange={(e) => setField("lowStockAlertEnabled", e.target.checked)} style={{ width: 15, height: 15, accentColor: "var(--sa-indigo)" }} />
                <label htmlFor="lowStockAlert" className="sa-form-label" style={{ margin: 0, cursor: "pointer" }}>
                  Enable Low Stock Alert
                </label>
              </div>
            </div>
          ) : (
            <>
              <div className="sa-stock-bar-track">
                <div className="sa-stock-bar-fill" style={{ width: `${stockPct}%` }} />
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--sa-text-muted)", textAlign: "right", margin: "0 0 14px" }}>
                {product.stock} / {stockMax} units
              </p>
              {[
                { label: "Status", value: <span className="sa-badge sa-badge-delivered" style={{ fontSize: "0.7rem" }}>In Stock</span> },
                { label: "Warehouse", value: product.warehouse ?? "Main Warehouse" },
                { label: "Location", value: product.warehouseLocation ?? "—" },
                { label: "Low Stock Alert", value: product.lowStockAlertEnabled !== false ? "Enable" : "Disable" },
              ].map((row, idx) => (
                <div key={idx} className="sa-product-stat-row">
                  <span className="sa-product-stat-label">{row.label}</span>
                  <span className="sa-product-stat-value">{row.value}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
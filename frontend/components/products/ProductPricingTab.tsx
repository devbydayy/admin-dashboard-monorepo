export function ProductPricingTab({ product, isEditing }: { product: any; isEditing: boolean }) {
  return (
    <div className="sa-card">
      <h3 style={{ fontWeight: 600, color: "var(--sa-text-primary)", marginBottom: 18 }}>Pricing Details</h3>
      <div className="row g-3">
        {[
          { label: "Regular Price ($)", value: product.price, type: "number", step: "0.01" },
          { label: "Sale Price ($)", value: product.salePrice ?? "", type: "number", step: "0.01" },
          { label: "Tax Class", value: product.taxClass ?? "Standard", type: "text" },
          { label: "Tax Rate (%)", value: product.taxRate ?? 10, type: "number", step: "0.1" },
        ].map((f) => (
          <div key={f.label} className="col-12 col-sm-6 col-lg-3">
            <label className="sa-form-label">{f.label}</label>
            <input type={f.type} step={(f as any).step} className="sa-form-control" defaultValue={f.value as any} readOnly={!isEditing} />
          </div>
        ))}
      </div>
    </div>
  );
}
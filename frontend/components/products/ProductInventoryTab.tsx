export function ProductInventoryTab({ product, isEditing }: { product: any; isEditing: boolean }) {
  return (
    <div className="sa-card">
      <h3 style={{ fontWeight: 600, color: "var(--sa-text-primary)", marginBottom: 18 }}>Inventory Settings</h3>
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <label className="sa-form-label">Stock Quantity</label>
          <input type="number" className="sa-form-control" defaultValue={product.stock} readOnly={!isEditing} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <label className="sa-form-label">Low Stock Threshold</label>
          <input type="number" className="sa-form-control" defaultValue={product.lowStockThreshold ?? 10} readOnly={!isEditing} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <label className="sa-form-label">Warehouse</label>
          <input type="text" className="sa-form-control" defaultValue={product.warehouse ?? ""} readOnly={!isEditing} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <label className="sa-form-label">Warehouse Location</label>
          <input type="text" className="sa-form-control" defaultValue={product.warehouseLocation ?? ""} readOnly={!isEditing} />
        </div>
      </div>
    </div>
  );
}
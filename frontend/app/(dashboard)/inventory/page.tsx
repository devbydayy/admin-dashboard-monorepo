"use client";

import { useState, useMemo } from "react";
import { Plus, AlertTriangle, Edit, Trash2, Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useLowStockAlerts, useAdjustStock } from "@/hooks/useInventory";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/types/product.types";
import { Button } from "@/components/ui/button";
import { Modal, ModalFooter } from "@/components/ui/Modal";

const LOW_STOCK_THRESHOLD = 10;

function getStockStatus(stock: number): string {
  if (stock === 0) return "Out of Stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "Low Stock";
  return "In Stock";
}

const stockBadgeClass: Record<string, string> = {
  "In Stock": "sa-badge-completed",
  "Low Stock": "sa-badge-pending",
  "Out of Stock": "sa-badge-cancelled",
};

export default function InventoryPage() {
  const { data: products, isLoading } = useProducts();
  const { data: alerts } = useLowStockAlerts(LOW_STOCK_THRESHOLD);
  const adjustStock = useAdjustStock();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchTerm) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operation, setOperation] = useState<"increment" | "decrement" | "set">("increment");
  const [amount, setAmount] = useState(0);

  const lowStockCount = alerts?.length ?? 0;

  const handleAdjustStock = () => {
    if (!selectedProduct) return;
    adjustStock.mutate(
      { productId: selectedProduct.id, operation, amount: Number(amount) },
      { onSuccess: () => { setIsModalOpen(false); setSelectedProduct(null); } }
    );
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => <span className="fw-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "id",
      header: "SKU",
      cell: ({ row }) => (
        <span className="font-monospace" style={{ fontSize: "0.75rem", color: "var(--sa-text-secondary)" }}>
          {row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => <span style={{ color: "var(--sa-text-secondary)" }}>{row.original.category?.name ?? "-"}</span>,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => <span className="fw-medium">{row.original.stock}</span>,
    },
    {
      id: "threshold",
      header: "Threshold",
      cell: () => <span style={{ color: "var(--sa-text-secondary)" }}>{LOW_STOCK_THRESHOLD}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = getStockStatus(row.original.stock);
        return (
          <span
            className={`sa-badge ${stockBadgeClass[status]}`}
            style={{
              padding: "0.25rem 0.625rem",
              fontSize: "0.75rem",
              fontWeight: 500,
              borderRadius: "999px",
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-link p-0 text-decoration-none"
            style={{
              color: "var(--sa-link-color)",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
            onClick={() => {
              setSelectedProduct(row.original);
              setOperation("increment");
              setAmount(0);
              setIsModalOpen(true);
            }}
          >
            Adjust Stock
          </button>
          <button
            className="btn btn-ghost p-1 border-0"
            style={{ color: "var(--sa-text-muted)", transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sa-indigo)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sa-text-muted)")}
          >
            <Edit size={16} />
          </button>
          <button
            className="btn btn-ghost p-1 border-0"
            style={{ color: "var(--sa-text-muted)", transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#dc3545")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sa-text-muted)")}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="d-flex justify-content-between align-items-center">
        <button className="btn btn-indigo d-inline-flex align-items-center gap-2">
          <Plus size={16} /> Add Item
        </button>

        <div className="position-relative" style={{ width: "100%", maxWidth: "16rem" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--sa-text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{
              paddingLeft: "2.25rem",
              paddingRight: "1rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              fontSize: "0.875rem",
              borderColor: "var(--sa-slate-200)",
              backgroundColor: "var(--sa-card-bg)",
              color: "var(--sa-text-primary)",
              borderRadius: "0.5rem",
              outline: "none",
              boxShadow: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--sa-indigo)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--sa-slate-200)")}
          />
        </div>
      </div>

      {lowStockCount > 0 && (
        <div
          className="d-flex align-items-center gap-2"
          style={{
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: "0.75rem",
            padding: "1rem 1.5rem",
            color: "#92400E",
            fontSize: "0.875rem",
          }}
        >
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <span>{lowStockCount} products are running low on stock. Review and restock soon.</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-5 text-muted">Loading inventory...</div>
      ) : (
        <DataTable columns={columns} data={filteredProducts} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adjust Stock"
        description={selectedProduct?.name}
        size="sm"
      >
        <div className="mb-3">
          <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
            Operation
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as any)}
            className="form-select"
            style={{
              borderColor: "var(--sa-slate-200)",
              backgroundColor: "var(--sa-card-bg)",
              color: "var(--sa-text-primary)",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            <option value="increment">Increment (+)</option>
            <option value="decrement">Decrement (−)</option>
            <option value="set">Set Exact</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
            Amount
          </label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
            className="form-control"
            style={{
              borderColor: "var(--sa-slate-200)",
              backgroundColor: "var(--sa-card-bg)",
              color: "var(--sa-text-primary)",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
            }}
          />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdjustStock} disabled={adjustStock.isPending}>
            {adjustStock.isPending ? "Saving..." : "Apply"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
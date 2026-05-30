"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product.types";
import { useCategories } from "@/hooks/useCategories";
import ProductImage from "@/components/ui/ProductImage";
import Link from "next/link";

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <Link
        href={`/products/${row.original.id}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div
          className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            width: 40,
            height: 40,
            backgroundColor: "var(--sa-slate-100)",
          }}
        >
          <ProductImage
            src={row.original.imageUrl}
            alt={row.original.name}
            size={40}
          />
        </div>
        <span className="fw-medium" style={{ color: "var(--sa-text-primary)" }}>
          {row.original.name}
        </span>
      </Link>
    ),
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => (
      <span style={{ fontSize: "0.875rem", color: "var(--sa-text-secondary)" }}>
        {row.original.category?.name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <span className="fw-medium">${row.original.price.toFixed(2)}</span>,
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => <span>{row.original.stock}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.status === "ACTIVE";
      return (
        <span
          className={`sa-badge ${isActive ? "sa-badge-completed" : "sa-badge-cancelled"}`}
          style={{
            padding: "0.25rem 0.625rem",
            fontSize: "0.75rem",
            fontWeight: 500,
            borderRadius: "999px",
          }}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <div className="d-flex gap-2" style={{ color: "var(--sa-text-muted)" }}>
        <button
          className="btn btn-ghost p-1 border-0"
          style={{ transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sa-indigo)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sa-text-muted)")}
        >
          <Edit size={16} />
        </button>
        <button
          className="btn btn-ghost p-1 border-0"
          style={{ transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#dc3545")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sa-text-muted)")}
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
];

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category?.id === categoryFilter);
    }
    if (statusFilter === "Active") {
      filtered = filtered.filter((p) => p.status === "ACTIVE");
    } else if (statusFilter === "Inactive") {
      filtered = filtered.filter((p) => p.status !== "ACTIVE");
    }
    return filtered;
  }, [products, searchTerm, categoryFilter, statusFilter]);

  if (isLoading) {
    return <div className="p-4">Loading products...</div>;
  }

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="d-flex flex-wrap align-items-center gap-2">
        <button className="btn btn-indigo d-inline-flex align-items-center gap-2">
          <Plus size={16} /> Add Product
        </button>

        <div className="d-flex align-items-center gap-2 ms-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
            style={{
              width: "auto",
              borderColor: "var(--sa-slate-200)",
              backgroundColor: "var(--sa-card-bg)",
              color: "var(--sa-text-primary)",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              padding: "0.5rem 0.75rem",
            }}
          >
            <option value="">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{
              width: "auto",
              minWidth: "130px",
              borderColor: "var(--sa-slate-200)",
              backgroundColor: "var(--sa-card-bg)",
              color: "var(--sa-text-primary)",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              padding: "0.5rem 0.75rem",
              paddingRight: "2rem",
            }}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

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
              placeholder="Search products..."
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
      </div>

      <DataTable columns={columns} data={filteredProducts} />
    </div>
  );
}
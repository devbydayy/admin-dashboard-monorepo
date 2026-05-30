"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/hooks/useCategories";

const columns: ColumnDef<Category>[] = [
  { accessorKey: "name", header: "Category Name" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "slug", header: "Slug" },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => <span>{row.original._count?.products ?? 0}</span>,
  },
  {
    id: "actions",
    cell: () => (
      <div className="d-flex gap-2" style={{ color: "var(--sa-text-muted)" }}>
        <button
          className="btn btn-ghost p-1 border-0"
          style={{ transition: "color 0.15s" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--sa-indigo)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--sa-text-muted)")
          }
        >
          <Edit size={16} />
        </button>
        <button
          className="btn btn-ghost p-1 border-0"
          style={{ transition: "color 0.15s" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "#dc3545")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--sa-text-muted)")
          }
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
];

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories?.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <button
          className="btn d-inline-flex align-items-center gap-2"
          style={{
            backgroundColor: "var(--sa-indigo)",
            borderColor: "var(--sa-indigo)",
            color: "#fff",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            padding: "0.5rem 1rem",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#4338ca")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--sa-indigo)")
          }
        >
          <Plus size={16} /> Add Category
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
            placeholder="Search categories..."
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
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--sa-indigo)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--sa-slate-200)")
            }
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5 text-muted">Loading categories...</div>
      ) : (
        <DataTable columns={columns} data={filteredCategories} />
      )}
    </div>
  );
}
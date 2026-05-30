"use client"

import { useState } from "react"
import { useCustomers } from "@/hooks/useCustomers"
import { DataTable } from "@/components/ui/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { CustomerDetailsSheet } from "@/components/customers/CustomerDetailsSheet"
import type { Customer } from "@/types/customer.types"

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="d-flex align-items-center gap-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center fw-medium"
          style={{
            width: 32,
            height: 32,
            backgroundColor: "var(--sa-indigo-100)",
            color: "var(--sa-indigo)",
            fontSize: "0.8rem",
          }}
        >
          {row.original.name.charAt(0)}
        </div>
        <Link
          href={`/customers/${row.original.id}`}
          className="sa-table-link fw-medium"
          onClick={(e) => e.stopPropagation()} 
        >
          {row.original.name}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span style={{ color: "var(--sa-text-secondary)" }}>
        {row.original.email}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span style={{ color: "var(--sa-text-secondary)" }}>
        {row.original.phone || "-"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <span style={{ color: "var(--sa-text-secondary)" }}>
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
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
]

export default function CustomersPage() {
  const { data: customers, isLoading } = useCustomers()
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsSheetOpen(true)
  }

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {isLoading ? (
        <div className="text-center py-5 text-muted">Loading customers...</div>
      ) : (
        <DataTable
          columns={columns}
          data={customers || []}
          searchKey="name"
          onRowClick={handleRowClick}
        />
      )}
      <CustomerDetailsSheet
        customer={selectedCustomer}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  )
}
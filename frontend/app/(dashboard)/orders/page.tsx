"use client"

import { useState, useMemo } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2, Filter, Download, Search } from "lucide-react"
import { useOrders } from "@/hooks/useOrders"
import { Order } from "@/types/order.types"
import Link from "next/link"

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order ID",
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original.id}`}
        className="sa-order-link"
      >
        {row.original.orderNumber}
      </Link>
    ),
  },
  {
    accessorKey: "customer.name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="d-flex align-items-center gap-2">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: 32,
            height: 32,
            backgroundColor: "var(--sa-slate-200)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--sa-text-primary)",
          }}
        >
          {row.original.customer?.name?.charAt(0) || "?"}
        </div>
        <span style={{ fontWeight: 500, fontSize: "0.875rem", color: "var(--sa-text-primary)" }}>
          {row.original.customer?.name || "Unknown"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "total",
    header: "Amount",
    cell: ({ row }) => <span>${row.original.total.toFixed(2)}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <span className={`sa-badge sa-badge-${status.toLowerCase()}`}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span style={{ fontSize: "0.875rem", color: "var(--sa-text-secondary)" }}>
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
]

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders()
  const [activeTab, setActiveTab] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const tabs = ["All", "Pending", "Paid", "Shipped", "Completed", "Cancelled"]

  const filteredOrders = useMemo(() => {
    if (!orders) return []

    let result = orders

    if (activeTab !== "All") {
      result = result.filter((order) => {
        const statusMap: Record<string, string> = {
          Pending: "PENDING",
          Paid: "PAID",
          Shipped: "SHIPPED",
          Completed: "COMPLETED",
          Cancelled: "CANCELLED",
        }
        return order.status === statusMap[activeTab]
      })
    }

    if (searchTerm.trim()) {
      result = result.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return result
  }, [orders, activeTab, searchTerm])

  if (isLoading) {
    return <div className="p-4">Loading orders...</div>
  }

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="d-flex justify-content-between align-items-center">
        <button className="sa-datepicker-btn">
          <Download size={15} /> Export
        </button>

        <div className="position-relative" style={{ maxWidth: "16rem", width: "100%" }}>
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
            placeholder="Search orders..."
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

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          borderBottom: "1px solid var(--sa-slate-200)",
          overflowX: "auto",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              paddingBottom: "0.75rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              whiteSpace: "nowrap",
              borderBottom: activeTab === tab ? "2px solid var(--sa-indigo)" : "2px solid transparent",
              color: activeTab === tab ? "var(--sa-indigo)" : "var(--sa-text-secondary)",
              background: "none",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              cursor: "pointer",
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab) e.currentTarget.style.color = "var(--sa-text-primary)"
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab) e.currentTarget.style.color = "var(--sa-text-secondary)"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={filteredOrders} />
    </div>
  )
}
"use client"

import { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {searchKey && (
        <div className="d-flex align-items-center" style={{
          padding: "0.5rem 0.75rem",
          border: "1px solid var(--sa-slate-200)",
          borderRadius: "0.5rem",
          backgroundColor: "var(--sa-card-bg)",
          maxWidth: "16rem",
        }}>
          <Search size={16} style={{ color: "var(--sa-text-muted)", marginRight: "0.5rem" }} />
          <input
            placeholder={`Search ${searchKey}...`}
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="bg-transparent border-0 outline-none w-100"
            style={{ fontSize: "0.875rem", color: "var(--sa-text-primary)", padding: 0 }}
          />
        </div>
      )}

      <div
        style={{
          backgroundColor: "var(--sa-card-bg)",
          border: "1px solid var(--sa-card-border)",
          borderRadius: "var(--sa-card-radius)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <table className="w-100" style={{ fontSize: "0.875rem", borderCollapse: "collapse" }}>
          <thead style={{
            backgroundColor: "var(--sa-slate-50)",
            color: "var(--sa-text-secondary)",
            borderBottom: "1px solid var(--sa-slate-200)",
          }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      padding: "0.75rem 2.5rem",
                      fontWeight: 500,
                      textAlign: "left",
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "d-flex align-items-center gap-1 user-select-none"
                            : ""
                        }
                        style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <ArrowUpDown size={14} style={{ color: "var(--sa-text-muted)" }} />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  style={{
                    borderTop: "1px solid var(--sa-slate-200)",
                    transition: "background-color 0.12s",
                    cursor: onRowClick ? "pointer" : "default",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(203, 213, 225, 0.25)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        padding: "0.75rem 2.5rem",
                        color: "var(--sa-text-primary)",
                        textAlign: "left",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-5"
                  style={{ color: "var(--sa-text-muted)" }}
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end align-items-center gap-2">
        <button
          className="btn btn-ghost p-2"
          style={{
            border: "1px solid var(--sa-slate-200)",
            borderRadius: "0.375rem",
            color: "var(--sa-text-primary)",
          }}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft size={16} />
        </button>
        <span className="small" style={{ color: "var(--sa-text-secondary)" }}>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          className="btn btn-ghost p-2"
          style={{
            border: "1px solid var(--sa-slate-200)",
            borderRadius: "0.375rem",
            color: "var(--sa-text-primary)",
          }}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/Badge";
import { Search } from "lucide-react";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import type { AuditLogEntry } from "@/types/audit-logs.types";

const columns: ColumnDef<AuditLogEntry>[] = [
  {
    accessorKey: "createdAt",
    header: "Date & Time",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleString(),
  },
  {
    accessorKey: "user.name",
    header: "User",
    cell: ({ row }) => row.original.user?.name || "System",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.original.action;
      const color =
        action === "Create"
          ? "bg-success text-white"
          : action === "Update"
          ? "bg-info text-dark"
          : action === "Delete"
          ? "bg-danger text-white"
          : "bg-secondary text-white";
      return (
        <Badge variant="outline" className={`${color} border-0`}>
          {action}
        </Badge>
      );
    },
  },
  {
    accessorKey: "entity",
    header: "Entity",
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => {
      const details = row.original.details;
      const changes = row.original.changes;
      if (changes?.status) {
        return (
          <>
            {details}{" "}
            <small className="text-muted">
              ({changes.status.old} → {changes.status.new})
            </small>
          </>
        );
      }
      return details;
    },
  },
];

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const { data, isLoading } = useAuditLogs({
    search: search || undefined,
    action: actionFilter || undefined,
    limit: 50,
    page: 1,
  });

  return (
    <div className="p-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <h2 className="fw-bold mb-0">Audit Logs</h2>
        <div className="d-flex gap-2">
          <div className="input-group input-group-sm w-auto">
            <span className="input-group-text bg-body">
              <Search size={16} className="text-muted" />
            </span>
            <input
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ maxWidth: 200 }}
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="form-select form-select-sm w-auto"
          >
            <option value="">All Actions</option>
            <option value="Create">Create</option>
            <option value="Update">Update</option>
            <option value="Delete">Delete</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5">Loading audit logs...</div>
      ) : (
        <div>
          <DataTable columns={columns} data={data?.logs || []} searchKey="entity" />
          <div className="text-muted small mt-3 text-end">
            Showing {data?.logs?.length || 0} of {data?.total || 0} logs
          </div>
        </div>
      )}
    </div>
  );
}
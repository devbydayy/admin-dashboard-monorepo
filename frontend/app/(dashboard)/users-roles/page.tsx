"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Edit2, Plus, Loader2, Search } from "lucide-react";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { useUsersList, useUpdateUser, UserItem } from "@/hooks/useUsersAdmin";

export default function UsersRolesPage() {
  const { data: users, isLoading } = useUsersList();
  const updateUser = useUpdateUser();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchTerm) return users;
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const openEdit = (user: UserItem) => {
    setEditingUser(user);
    setEditName(user.name || "");
    setEditRole(user.role);
    setEditStatus(user.status);
  };

  const saveEdit = () => {
    if (!editingUser) return;
    updateUser.mutate(
      {
        id: editingUser.id,
        data: {
          name: editName,
          role: editRole as any,
          status: editStatus as any,
        },
      },
      {
        onSuccess: () => setEditingUser(null),
      }
    );
  };

  const columns: ColumnDef<UserItem>[] = [
    {
      accessorKey: "name",
      header: "User",
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
            {row.original.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="mb-0 fw-medium" style={{ color: "var(--sa-text-primary)" }}>
              {row.original.name || "No Name"}
            </p>
            <p className="mb-0" style={{ fontSize: "0.75rem", color: "var(--sa-text-secondary)" }}>
              {row.original.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="text-capitalize" style={{ color: "var(--sa-text-secondary)" }}>
          {row.original.role.replace(/_/g, " ").toLowerCase()}
        </span>
      ),
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
            {row.original.status}
          </span>
        );
      },
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
      cell: ({ row }) => (
        <span style={{ color: "var(--sa-text-secondary)" }}>
          {new Date(row.original.lastActive).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-ghost p-1 border-0"
            style={{ color: "var(--sa-text-muted)", transition: "color 0.15s" }}
            onClick={() => openEdit(row.original)}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sa-indigo)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sa-text-muted)")}
          >
            <Edit2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="d-flex justify-content-between align-items-center">
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--sa-indigo)")}
        >
          <Plus size={16} /> Invite User
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
            placeholder="Search users..."
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

      {isLoading ? (
        <div className="text-center py-5 text-muted">Loading users...</div>
      ) : (
        <DataTable columns={columns} data={filteredUsers} />
      )}

      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
        description={editingUser?.email}
        size="sm"
      >
        <div className="mb-3">
          <label className="form-label small fw-medium">Name</label>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="form-control"
            style={{
              borderColor: "var(--sa-slate-200)",
              backgroundColor: "var(--sa-card-bg)",
              color: "var(--sa-text-primary)",
              borderRadius: "0.5rem",
            }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-medium">Role</label>
          <select
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
            className="form-select"
            style={{
              borderColor: "var(--sa-slate-200)",
              backgroundColor: "var(--sa-card-bg)",
              color: "var(--sa-text-primary)",
              borderRadius: "0.5rem",
            }}
          >
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="SUPPORT">Support</option>
            <option value="USER">User</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label small fw-medium">Status</label>
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
            className="form-select"
            style={{
              borderColor: "var(--sa-slate-200)",
              backgroundColor: "var(--sa-card-bg)",
              color: "var(--sa-text-primary)",
              borderRadius: "0.5rem",
            }}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setEditingUser(null)}>
            Cancel
          </Button>
          <Button onClick={saveEdit} disabled={updateUser.isPending}>
            {updateUser.isPending ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
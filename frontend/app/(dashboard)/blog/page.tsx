"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useBlogs } from "@/hooks/useBlogs";

export default function BlogPage() {
  const { data: blogs, isLoading } = useBlogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPosts = blogs
    ? blogs.filter((post) => {
        const matchesSearch = post.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "published" && post.published) ||
          (statusFilter === "draft" && !post.published);
        return matchesSearch && matchesStatus;
      })
    : [];

  if (isLoading) {
    return <div className="p-4">Loading blog posts...</div>;
  }

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <Link
          href="/blog/new"
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
          <Plus size={16} /> New Post
        </Link>

        <div className="d-flex gap-2 align-items-center">
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
              placeholder="Search posts..."
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{
              width: "auto",
              borderColor: "var(--sa-slate-200)",
              backgroundColor: "var(--sa-card-bg)",
              color: "var(--sa-text-primary)",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              paddingLeft: "0.75rem",
            }}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "var(--sa-card-bg)",
          border: "1px solid var(--sa-slate-200)",
          borderRadius: "0.75rem",
          overflow: "hidden",
        }}
      >
        <div className="table-responsive">
          <table className="w-100" style={{ fontSize: "0.875rem", borderCollapse: "collapse" }}>
            <thead
              style={{
                backgroundColor: "var(--sa-slate-50)",
                borderBottom: "1px solid var(--sa-slate-200)",
                color: "var(--sa-text-secondary)",
              }}
            >
              <tr>
                <th
                  className="fw-medium"
                  style={{ padding: "1rem 2rem 1rem 2rem", textAlign: "left" }}
                >
                  Title
                </th>
                <th
                  className="fw-medium"
                  style={{ padding: "1rem 2rem", textAlign: "left" }}
                >
                  Status
                </th>
                <th
                  className="fw-medium"
                  style={{ padding: "1rem 2rem", textAlign: "left" }}
                >
                  Author
                </th>
                <th
                  className="fw-medium"
                  style={{ padding: "1rem 2rem", textAlign: "left" }}
                >
                  Date
                </th>
                <th
                  className="fw-medium"
                  style={{ padding: "1rem 2rem", textAlign: "left" }}
                >
                  Views
                </th>
                <th
                  className="fw-medium"
                  style={{ padding: "1rem 2rem", textAlign: "left" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  style={{
                    borderTop: "1px solid var(--sa-slate-200)",
                    transition: "background-color 0.12s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(203, 213, 225, 0.25)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td
                    style={{
                      padding: "1rem 2rem",
                      color: "var(--sa-text-primary)",
                      fontWeight: 500,
                    }}
                  >
                    {post.title}
                  </td>
                  <td style={{ padding: "1rem 2rem" }}>
                    <span
                      className={`sa-badge ${
                        post.published ? "sa-badge-completed" : "sa-badge-pending"
                      }`}
                      style={{
                        padding: "0.25rem 0.625rem",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        borderRadius: "999px",
                      }}
                    >
                      {post.published ? "published" : "draft"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 2rem", color: "var(--sa-text-secondary)" }}>
                    {post.author?.name || "Unknown"}
                  </td>
                  <td style={{ padding: "1rem 2rem", color: "var(--sa-text-secondary)" }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1rem 2rem", color: "var(--sa-text-secondary)" }}>
                    0
                  </td>
                  <td style={{ padding: "1rem 2rem" }}>
                    <div className="d-flex gap-3">
                      <button
                        className="btn btn-ghost p-0 border-0"
                        style={{
                          color: "var(--sa-text-muted)",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "var(--sa-indigo)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "var(--sa-text-muted)")
                        }
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn btn-ghost p-0 border-0"
                        style={{
                          color: "var(--sa-text-muted)",
                          transition: "color 0.15s",
                        }}
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
                        className="btn btn-ghost p-0 border-0"
                        style={{
                          color: "var(--sa-text-muted)",
                          transition: "color 0.15s",
                        }}
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
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4"
                    style={{ color: "var(--sa-text-muted)" }}
                  >
                    No blog posts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
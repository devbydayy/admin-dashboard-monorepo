"use client"

import { Plus, Edit, Trash2, Megaphone } from "lucide-react"

const mockCampaigns = [
  { id: "1", name: "Summer Sale 2024",    channel: "Email",    status: "Active",   sent: 12400, opens: 4230, clicks: 890, startDate: "Jun 01, 2024", endDate: "Jun 30, 2024" },
  { id: "2", name: "New Arrivals Promo",  channel: "SMS",      status: "Active",   sent: 8200,  opens: 0,    clicks: 1240, startDate: "May 15, 2024", endDate: "May 31, 2024" },
  { id: "3", name: "Loyalty Rewards",     channel: "Push",     status: "Draft",    sent: 0,     opens: 0,    clicks: 0,   startDate: "Jul 01, 2024", endDate: "Jul 31, 2024" },
  { id: "4", name: "Spring Clearance",    channel: "Email",    status: "Ended",    sent: 15000, opens: 6100, clicks: 1300, startDate: "Mar 01, 2024", endDate: "Mar 31, 2024" },
]

const statusClasses: Record<string, string> = {
  Active: "sa-badge-completed",
  Draft:  "sa-badge-pending",
}

const endedBadgeStyle = {
  backgroundColor: "var(--sa-slate-100)",
  color: "var(--sa-text-secondary)",
}

export default function CampaignsPage() {
  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
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
          <Plus size={16} /> New Campaign
        </button>
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
          <table
            className="w-100 text-nowrap"
            style={{ fontSize: "0.875rem", borderCollapse: "collapse" }}
          >
            <thead
              style={{
                backgroundColor: "var(--sa-slate-50)",
                borderBottom: "1px solid var(--sa-slate-200)",
                color: "var(--sa-text-secondary)",
              }}
            >
              <tr>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Campaign</th>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Channel</th>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Sent</th>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Opens</th>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Clicks</th>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Duration</th>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Status</th>
                <th className="fw-medium" style={{ padding: "1rem 1.5rem", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCampaigns.map((c) => (
                <tr
                  key={c.id}
                  style={{
                    borderTop: "1px solid var(--sa-slate-200)",
                    transition: "background-color 0.12s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(203, 213, 225, 0.25)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div className="d-flex align-items-center gap-2">
                      <Megaphone size={16} style={{ color: "var(--sa-indigo)" }} />
                      <span className="fw-medium" style={{ color: "var(--sa-text-primary)" }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--sa-text-secondary)" }}>{c.channel}</td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--sa-text-secondary)" }}>{c.sent.toLocaleString()}</td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--sa-text-secondary)" }}>{c.opens.toLocaleString()}</td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--sa-text-secondary)" }}>{c.clicks.toLocaleString()}</td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--sa-text-secondary)", fontSize: "0.8125rem" }}>{c.startDate} – {c.endDate}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    {c.status === "Ended" ? (
                      <span
                        className="sa-badge"
                        style={{
                          ...endedBadgeStyle,
                          padding: "0.25rem 0.625rem",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          borderRadius: "999px",
                        }}
                      >
                        Ended
                      </span>
                    ) : (
                      <span
                        className={`sa-badge ${statusClasses[c.status] || "sa-badge-pending"}`}
                        style={{
                          padding: "0.25rem 0.625rem",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          borderRadius: "999px",
                        }}
                      >
                        {c.status}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div className="d-flex gap-3">
                      <button
                        className="btn btn-ghost p-0 border-0"
                        style={{ color: "var(--sa-text-muted)", transition: "color 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sa-indigo)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sa-text-muted)")}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-ghost p-0 border-0"
                        style={{ color: "var(--sa-text-muted)", transition: "color 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#dc3545")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sa-text-muted)")}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
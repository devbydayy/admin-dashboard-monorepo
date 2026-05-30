"use client";

import { ShoppingBag, CreditCard, UserPlus, Package, Star } from "lucide-react";
import Link from "next/link";

const activities = [
  {
    icon:      ShoppingBag,
    text:      "New order #ORD-7845",
    time:      "2 min ago",
    highlight: true,
  },
  {
    icon:      CreditCard,
    text:      "Payment received from Esther Howard",
    time:      "5 min ago",
    highlight: false,
  },
  {
    icon:      UserPlus,
    text:      "New customer registered",
    subtext:   "Brooklyn Simmons",
    time:      "10 min ago",
    highlight: false,
  },
  {
    icon:      Package,
    text:      'Product "Smart Watch Series 8"',
    subtext:   "low in stock (5 left)",
    time:      "15 min ago",
    highlight: true,
  },
  {
    icon:      Star,
    text:      "New review for Wireless Headphones",
    subtext:   "★★★★★",
    time:      "25 min ago",
    highlight: false,
  },
];

export default function LiveActivity() {
  return (
    <div className="sa-card" style={{ flex: 1 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span className="sa-chart-title">Live Activity</span>
        <Link href="#" className="sa-view-all">View all</Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {activities.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  backgroundColor: a.highlight
                    ? "var(--sa-indigo-100)"
                    : "var(--sa-slate-100)",
                  color: a.highlight
                    ? "var(--sa-indigo)"
                    : "var(--sa-text-secondary)",
                }}
              >
                <Icon size={15} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "var(--sa-text-primary)",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {a.text}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 3,
                  }}
                >
                  {a.subtext && (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--sa-text-secondary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {a.subtext}
                    </span>
                  )}
                  {a.subtext && (
                    <span style={{ color: "var(--sa-text-muted)", fontSize: "0.6rem" }}>·</span>
                  )}
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--sa-text-muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from "recharts";
import { ChevronDown, ArrowUpRight } from "lucide-react";

const trafficData = [
  { name: "Direct",       percentage: 45.2, color: "#4F46E5" },
  { name: "Search",       percentage: 28.5, color: "#10B981" },
  { name: "Social Media", percentage: 15.2, color: "#F59E0B" },
  { name: "Referral",     percentage: 7.1,  color: "#EC4899" },
  { name: "Email",        percentage: 4.0,  color: "#06B6D4" },
];

const sparklineData = [
  { v: 18000 }, { v: 20500 }, { v: 19200 }, { v: 22000 },
  { v: 21500 }, { v: 23000 }, { v: 23869 },
];

export default function TrafficSources() {
  return (
    <div className="sa-card h-100" style={{ display: "flex", flexDirection: "column" }}>
      <div className="sa-chart-header">
        <span className="sa-chart-title">Traffic Sources</span>
        <button className="sa-dropdown-btn">
          This Week <ChevronDown size={13} style={{ marginLeft: 2 }} />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 96, height: 96, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trafficData}
                cx="50%"
                cy="50%"
                innerRadius={27}
                outerRadius={44}
                dataKey="percentage"
                strokeWidth={2}
                stroke="transparent"
              >
                {trafficData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
          {trafficData.map((source) => (
            <div
              key={source.name}
              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.75rem" }}
            >
              <div
                className="sa-traffic-dot"
                style={{ backgroundColor: source.color }}
              />
              <span style={{ flex: 1, color: "var(--sa-text-secondary)" }}>
                {source.name}
              </span>
              <span style={{ fontWeight: 600, color: "var(--sa-text-primary)" }}>
                {source.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: "1px solid var(--sa-card-border)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p style={{ fontSize: "0.75rem", color: "var(--sa-text-muted)", margin: "0 0 4px" }}>
            Total Visitors
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--sa-text-primary)" }}>
              23,869
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#10B981",
              }}
            >
              <ArrowUpRight size={14} />
              12.5%
            </span>
          </div>
        </div>
        <div style={{ width: 90, height: 40 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke="#6366f1"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChevronDown } from "lucide-react";

const PERIOD_PRESETS = ["Today", "This Week", "This Month", "Last 30 Days"];

interface OrdersChartProps {
  data?: { name: string; value: number }[];
  period: string;
  onPeriodChange: (preset: string) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#1e293b",
          color: "#fff",
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: "0.8125rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
          border: "none",
        }}
      >
        <p style={{ color: "#94A3B8", fontSize: "0.72rem", margin: "0 0 3px" }}>
          {label}
        </p>
        <p style={{ fontWeight: 700, margin: 0, fontSize: "0.9375rem", color: "#10B981" }}>
          Orders : {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

function shortLabel(label: string): string {
  if (!label.includes(" - ")) return label;
  const [start, end] = label.split(" - ");
  const startMonth = start.split(" ")[0];
  const endMonth = end.split(" ")[0];
  if (startMonth === endMonth) {
    return `${start}-${end.split(" ")[1]}`; 
  }
  return label;
}

export default function OrdersChart({
  data = [],
  period,
  onPeriodChange,
}: OrdersChartProps) {
  const chartData = data.length > 0 ? data : [];
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <div
      className="sa-card"
      style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 320 }}
    >
      <div className="sa-chart-header">
        <h3 className="sa-chart-title">Orders Overview</h3>
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            className="sa-dropdown-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {period} <ChevronDown size={13} style={{ marginLeft: 4 }} />
          </button>
          {showDropdown && (
            <div
              className="sa-dropdown-menu"
              style={{ right: 0, top: "calc(100% + 4px)", minWidth: 140 }}
            >
              {PERIOD_PRESETS.map((preset) => (
                <button
                  key={preset}
                  className="sa-dropdown-item"
                  onClick={() => {
                    setShowDropdown(false);
                    onPeriodChange(preset);
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 260 }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 6, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={shortLabel}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tickFormatter={(v) => v.toString()}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#ordersGradient)"
                dot={false}
                activeDot={{ r: 5, fill: "#10b981", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            No data for selected range
          </div>
        )}
      </div>
    </div>
  );
}
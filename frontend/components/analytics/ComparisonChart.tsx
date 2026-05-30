"use client";
import { useState, useRef, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import LegendLine from "./LegendLine";

interface ComparisonChartProps {
  title: string;
  data: { name: string; current: number; prev: number }[];
  yFormatter: (v: number) => string;
  tooltipFormatter: (v: number) => string;
  currentLabel: string;
  prevLabel: string;
  period: string;
  onPeriodChange: (preset: string) => void;
}

const PERIOD_PRESETS = ["Today", "This Week", "This Month", "Last 30 Days"];

export default function ComparisonChart({
  title, data, yFormatter, tooltipFormatter,
  currentLabel, prevLabel, period, onPeriodChange,
}: ComparisonChartProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setShowDropdown(false);
    };
    if (showDropdown) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  return (
    <div className="sa-card"
      style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 280, padding: "16px 18px" }}
    >
      <div className="sa-chart-header" style={{ marginBottom: 8 }}>
        <h3 className="sa-chart-title" style={{ fontSize: "0.85rem" }}>{title}</h3>

        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            className="sa-dropdown-btn"
            style={{ fontSize: "0.75rem" }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {period}&nbsp;<span style={{ fontSize: "0.65rem" }}>▾</span>
          </button>
          {showDropdown && (
            <div className="sa-dropdown-menu" style={{ right: 0, top: "calc(100% + 4px)", minWidth: 140 }}>
              {PERIOD_PRESETS.map((preset) => (
                <button key={preset} className="sa-dropdown-item" style={{ fontSize: "0.75rem" }}
                  onClick={() => { setShowDropdown(false); onPeriodChange(preset); }}>
                  {preset}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="sa-legend-row" style={{ marginBottom: 6, fontSize: "0.72rem" }}>
        <div className="sa-legend-item">
          <LegendLine color="#4F46E5" />
          <span>{currentLabel}</span>
        </div>
        <div className="sa-legend-item">
          <LegendLine color="#94A3B8" dashed />
          <span>{prevLabel}</span>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} tickFormatter={yFormatter} width={40} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "none", backgroundColor: "#1e293b", color: "#fff", fontSize: "0.75rem", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
              labelStyle={{ color: "#94A3B8", fontSize: 10, marginBottom: 4 }}
              formatter={(value: number, name: string) => [tooltipFormatter(value), name === "current" ? currentLabel : prevLabel]}
            />
            <Line type="monotone" dataKey="prev" stroke="#CBD5E1" strokeWidth={1.8} strokeDasharray="5 3" dot={false} activeDot={{ r: 4, fill: "#94A3B8", strokeWidth: 0 }} />
            <Line type="monotone" dataKey="current" stroke="#4F46E5" strokeWidth={2.2} dot={false} activeDot={{ r: 5, fill: "#4F46E5", strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
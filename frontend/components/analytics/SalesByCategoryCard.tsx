"use client";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface SalesByCategoryCardProps {
  totalRevenue: number;
}

const SALES_DATA = [
  { name: "Electronics", value: 42.5, color: "#4F46E5" },
  { name: "Apparel", value: 23.8, color: "#10B981" },
  { name: "Accessories", value: 15.6, color: "#F59E0B" },
  { name: "Home & Living", value: 10.4, color: "#06B6D4" },
  { name: "Others", value: 7.7, color: "#94A3B8" },
];

export default function SalesByCategoryCard({ totalRevenue }: SalesByCategoryCardProps) {
  const size = 160;
  const centerFont = size * 0.0058;
  const subFont = size * 0.0042;

  return (
    <div className="sa-card" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 18px" }}>
      <h3 className="sa-chart-title" style={{ marginBottom: 10, fontSize: "0.85rem" }}>Sales by Category</h3>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
        <div style={{ position: "relative", width: size, height: size }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={SALES_DATA} cx="50%" cy="50%" innerRadius={size * 0.32} outerRadius={size * 0.46}
                dataKey="value" strokeWidth={2} stroke="var(--sa-card-bg)" startAngle={90} endAngle={-270}>
                {SALES_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)", textAlign: "center",
            lineHeight: 1.3, pointerEvents: "none", width: "80%",
          }}>
            <div style={{ fontSize: `${centerFont}rem`, fontWeight: 700, color: "var(--sa-text-primary)", whiteSpace: "nowrap" }}>
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: `${subFont}rem`, color: "var(--sa-text-muted)", marginTop: 1, whiteSpace: "nowrap" }}>
              Total Revenue
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 8px" }}>
        {SALES_DATA.map((cat) => (
          <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.72rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: cat.color, flexShrink: 0 }} />
            <span style={{ flex: 1, color: "var(--sa-text-secondary)", whiteSpace: "nowrap" }}>{cat.name}</span>
            <span style={{ fontWeight: 600, color: "var(--sa-text-primary)", marginLeft: 8 }}>{cat.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  iconBg: string;
  compareLabel?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  trend,
  trendUp,
  icon,
  iconBg,
  compareLabel,
  className = "",
}: StatCardProps) {
  const isClassName = iconBg.includes(" ");
  const iconStyle = isClassName ? undefined : { backgroundColor: iconBg };
  const iconClass = isClassName ? iconBg : "";

  return (
    <div className={`stat-card card shadow-sm h-100 ${className}`} 
         style={{ padding: "12px 14px" }}>
      <div className="card-body" style={{ padding: 0 }}>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <small className="text-muted fw-medium" style={{ fontSize: "0.75rem" }}>
            {title}
          </small>
          <div
            className={`rounded-3 d-flex align-items-center justify-content-center ${iconClass}`}
            style={{
              width: 36,
              height: 36,
              ...iconStyle,
            }}
          >
            {icon}
          </div>
        </div>
        <h3 className="sa-stat-value fw-bold mb-1" style={{ fontSize: "1.5rem" }}>
          {value}
        </h3>
        <div className="d-flex align-items-center gap-1">
          <span className={trendUp ? "sa-trend-up" : "sa-trend-down"} style={{ fontSize: "0.75rem" }}>
            {trendUp ? (
              <ArrowUpRight size={14} style={{ verticalAlign: "middle", marginRight: 2 }} />
            ) : (
              <ArrowDownRight size={14} style={{ verticalAlign: "middle", marginRight: 2 }} />
            )}
            {trend}
          </span>
          <span className="sa-trend-muted" style={{ fontSize: "0.75rem" }}>
            vs last week
          </span>
        </div>
        {compareLabel && (
          <div className="sa-trend-muted" style={{ fontSize: "0.65rem", marginTop: 2 }}>
            {compareLabel}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
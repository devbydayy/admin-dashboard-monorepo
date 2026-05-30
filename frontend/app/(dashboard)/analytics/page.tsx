"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { StatCard } from "@/components/ui/StatCard";
import {
  DollarSign, ShoppingBag, Users, Package, TrendingUp,
  CalendarDays, ChevronDown, Download,
} from "lucide-react";
import { useDashboardStats, useAnalyticsSnapshots } from "@/hooks/useAnalytics";
import { useOrders } from "@/hooks/useOrders";
import { STATIC_TODAY } from "@/lib/constants";
import {
  getDateRangeFromPreset,
  fmtShort,
  rangeLabel,
  buildChartData,
  sumMetric,
} from "@/lib/chartHelpers";
import dynamic from "next/dynamic";

const ComparisonChart = dynamic(
  () => import("@/components/analytics/ComparisonChart"),
  {
    ssr: false,
    loading: () => (
      <div
        className="sa-card"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 280,
          padding: "16px 18px",
        }}
      >
        <div className="sa-skeleton" style={{ flex: 1, borderRadius: 8 }} />
      </div>
    ),
  }
);

const SalesByCategoryCard = dynamic(
  () => import("@/components/analytics/SalesByCategoryCard"),
  {
    ssr: false,
    loading: () => (
      <div className="sa-card" style={{ height: 320 }}>
        <div className="sa-skeleton" style={{ height: "100%" }} />
      </div>
    ),
  }
);

const TopProductsTable = dynamic(
  () => import("@/components/analytics/TopProductsTable"),
  {
    ssr: false,
    loading: () => (
      <div className="sa-card" style={{ height: 320 }}>
        <div className="sa-skeleton" style={{ height: "100%" }} />
      </div>
    ),
  }
);

const RecentOrdersTable = dynamic(
  () => import("@/components/analytics/RecentOrdersTable"),
  {
    ssr: false,
    loading: () => (
      <div className="sa-card" style={{ height: 320 }}>
        <div className="sa-skeleton" style={{ height: "100%" }} />
      </div>
    ),
  }
);

export default function AnalyticsPage() {
  const [primaryStart, setPrimaryStart] = useState(() => {
    const d = new Date(STATIC_TODAY); d.setDate(d.getDate() - 6); return d.toISOString().split("T")[0];
  });
  const [primaryEnd, setPrimaryEnd] = useState(() => STATIC_TODAY.toISOString().split("T")[0]);
  const [compareStart, setCompareStart] = useState(() => {
      const d = new Date(STATIC_TODAY);
      d.setMonth(d.getMonth() - 1);
      d.setDate(d.getDate() - 6);
      return d.toISOString().split("T")[0];
  });
  const [compareEnd, setCompareEnd] = useState(() => {
      const d = new Date(STATIC_TODAY);
      d.setMonth(d.getMonth() - 1);
      return d.toISOString().split("T")[0];
  });
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showComparePicker, setShowComparePicker] = useState(false);

  const { data: overview } = useDashboardStats();
  const { data: snapshots } = useAnalyticsSnapshots("daily", 90);
  const { data: allOrders } = useOrders();

  const totalRevenue = overview?.revenue ?? 0;
  const totalOrders  = overview?.orders ?? 0;
  const customers    = overview?.customers ?? 0;
  const convRate     = overview?.conversionRate ?? 0;

  const revenueChartData = useMemo(() => {
    const primary = buildChartData(snapshots, allOrders, primaryStart, primaryEnd, "revenue");
    const compare = buildChartData(snapshots, allOrders, compareStart, compareEnd, "revenue");
    return primary.map((p) => {
      const prev = compare.find((c) => c.day === p.day);
      return { name: p.name, current: p.value, prev: prev ? prev.value : 0 };
    });
  }, [snapshots, allOrders, primaryStart, primaryEnd, compareStart, compareEnd]);

  const ordersChartData = useMemo(() => {
    const primary = buildChartData(snapshots, allOrders, primaryStart, primaryEnd, "orders");
    const compare = buildChartData(snapshots, allOrders, compareStart, compareEnd, "orders");
    return primary.map((p) => {
      const prev = compare.find((c) => c.day === p.day);
      return { name: p.name, current: p.value, prev: prev ? prev.value : 0 };
    });
  }, [snapshots, allOrders, primaryStart, primaryEnd, compareStart, compareEnd]);

  const topProducts = overview?.topProducts?.length
    ? overview.topProducts.map((p: any) => ({
        productId: p.productId,
        name: p.name,
        image: p.image,
        quantitySold: p.quantitySold,
        price: p.price,
        revenue: p.price * p.quantitySold,
      }))
    : [];

  const recentOrders = (allOrders ?? []).slice(0, 5);

  const primaryRevenueTotal = useMemo(
    () => sumMetric(snapshots, allOrders, primaryStart, primaryEnd, "revenue"),
    [snapshots, allOrders, primaryStart, primaryEnd]
  );
  const compareRevenueTotal = useMemo(
    () => sumMetric(snapshots, allOrders, compareStart, compareEnd, "revenue"),
    [snapshots, allOrders, compareStart, compareEnd]
  );
  const primaryOrdersTotal = useMemo(
    () => sumMetric(snapshots, allOrders, primaryStart, primaryEnd, "orders"),
    [snapshots, allOrders, primaryStart, primaryEnd]
  );
  const compareOrdersTotal = useMemo(
    () => sumMetric(snapshots, allOrders, compareStart, compareEnd, "orders"),
    [snapshots, allOrders, compareStart, compareEnd]
  );

  const revenueTrend = compareRevenueTotal > 0
    ? (((primaryRevenueTotal - compareRevenueTotal) / compareRevenueTotal) * 100).toFixed(1) + "%"
    : "+18.6%";
  const revenueTrendUp = compareRevenueTotal > 0 ? primaryRevenueTotal >= compareRevenueTotal : true;

  const ordersTrend = compareOrdersTotal > 0
    ? (((primaryOrdersTotal - compareOrdersTotal) / compareOrdersTotal) * 100).toFixed(1) + "%"
    : "+12.4%";
  const ordersTrendUp = compareOrdersTotal > 0 ? primaryOrdersTotal >= compareOrdersTotal : true;

  const currentYear = STATIC_TODAY.getFullYear();
  const primaryLabel = rangeLabel(primaryStart, primaryEnd, currentYear);
  const compareLabel = rangeLabel(compareStart, compareEnd, currentYear);
  const compareVsLabel = `vs ${fmtShort(compareStart, compareEnd)}`;

  const handlePrimaryPreset = (preset: string) => {
    const { start, end } = getDateRangeFromPreset(preset);
    setPrimaryStart(start.toISOString().split("T")[0]);
    setPrimaryEnd(end.toISOString().split("T")[0]);
  };

  const primaryPickerRef = useRef<HTMLDivElement>(null);
  const comparePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        primaryPickerRef.current &&
        !primaryPickerRef.current.contains(e.target as Node)
      ) {
        setShowPrimaryPicker(false);
      }
    }
    if (showPrimaryPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPrimaryPicker]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        comparePickerRef.current &&
        !comparePickerRef.current.contains(e.target as Node)
      ) {
        setShowComparePicker(false);
      }
    }
    if (showComparePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showComparePicker]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div ref={primaryPickerRef} style={{ position: "relative" }}>
          <button className="sa-datepicker-btn"
            onClick={() => { setShowPrimaryPicker(!showPrimaryPicker); setShowComparePicker(false); }}>
            <CalendarDays size={15} color="var(--sa-text-muted)" />
            <span>{primaryLabel}</span>
            <ChevronDown size={13} color="var(--sa-text-muted)" />
          </button>
          {showPrimaryPicker && (
            <div className="sa-datepicker-dropdown">
              <p style={{ fontSize: "0.72rem", color: "var(--sa-text-muted)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Primary Period
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="date" value={primaryStart} onChange={(e) => setPrimaryStart(e.target.value)} className="sa-date-input" />
                <span style={{ color: "var(--sa-text-muted)" }}>–</span>
                <input type="date" value={primaryEnd} onChange={(e) => setPrimaryEnd(e.target.value)} className="sa-date-input" />
              </div>
              <button className="sa-btn-outline" style={{ marginTop: 10, width: "100%", justifyContent: "center" }}
                onClick={() => setShowPrimaryPicker(false)}>Apply</button>
            </div>
          )}
        </div>

        <div ref={comparePickerRef} style={{ position: "relative" }}>
          <button className="sa-datepicker-btn"
            onClick={() => { setShowComparePicker(!showComparePicker); setShowPrimaryPicker(false); }}>
            <span style={{ color: "var(--sa-text-muted)", fontSize: "0.75rem" }}>Compare to:</span>
            <span>{compareLabel}</span>
            <ChevronDown size={13} color="var(--sa-text-muted)" />
          </button>
          {showComparePicker && (
            <div className="sa-datepicker-dropdown">
              <p style={{ fontSize: "0.72rem", color: "var(--sa-text-muted)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Compare Period
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="date" value={compareStart} onChange={(e) => setCompareStart(e.target.value)} className="sa-date-input" />
                <span style={{ color: "var(--sa-text-muted)" }}>–</span>
                <input type="date" value={compareEnd} onChange={(e) => setCompareEnd(e.target.value)} className="sa-date-input" />
              </div>
              <button className="sa-btn-outline" style={{ marginTop: 10, width: "100%", justifyContent: "center" }}
                onClick={() => setShowComparePicker(false)}>Apply</button>
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />
        <button className="sa-btn-outline"><Download size={14} /> Export Report</button>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-5 g-4">
        <div className="col" style={{ maxHeight: 140 }}>
          <StatCard title="Total Revenue"
            value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            trend={revenueTrend} trendUp={revenueTrendUp}
            icon={<DollarSign size={18} color="var(--sa-indigo)" />} iconBg="var(--sa-indigo-100)"
            compareLabel={compareVsLabel} />
        </div>
        <div className="col" style={{ maxHeight: 140 }}>
          <StatCard title="Orders" value={totalOrders.toLocaleString()}
            trend={ordersTrend} trendUp={ordersTrendUp}
            icon={<ShoppingBag size={18} color="var(--sa-green)" />} iconBg="var(--sa-green-100)"
            compareLabel={compareVsLabel} />
        </div>
        <div className="col" style={{ maxHeight: 140 }}>
          <StatCard title="Customers" value={customers.toLocaleString()} trend="+8.2%" trendUp={true}
            icon={<Users size={18} color="var(--sa-amber)" />} iconBg="rgba(245,158,11,0.12)"
            compareLabel={compareVsLabel} />
        </div>
        <div className="col" style={{ maxHeight: 140 }}>
          <StatCard title="Products Sold" value="620" trend="+15.3%" trendUp={true}
            icon={<Package size={18} color="var(--sa-blue)" />} iconBg="var(--sa-blue-100)"
            compareLabel={compareVsLabel} />
        </div>
        <div className="col" style={{ maxHeight: 140 }}>
          <StatCard title="Conversion Rate" value={`${convRate.toFixed(2)}%`} trend="-2.4%" trendUp={false}
            icon={<TrendingUp size={18} color="#8B5CF6" />} iconBg="rgba(139,92,246,0.12)"
            compareLabel={compareVsLabel} />
        </div>
      </div>

      <div className="row g-4 align-items-stretch" style={{ minHeight: 340 }}>
        <div className="col-12 col-xl-6 d-flex flex-column" style={{ maxHeight: 340 }}>
          <ComparisonChart
            title="Revenue Overview"
            data={revenueChartData}
            currentLabel={primaryLabel}
            prevLabel={compareLabel}
            yFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`}
            tooltipFormatter={(v) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            period={primaryLabel}
            onPeriodChange={handlePrimaryPreset}
          />
        </div>
        <div className="col-12 col-xl-6 d-flex flex-column" style={{ maxHeight: 340 }}>
          <ComparisonChart
            title="Orders Overview"
            data={ordersChartData}
            currentLabel={primaryLabel}
            prevLabel={compareLabel}
            yFormatter={(v) => v.toString()}
            tooltipFormatter={(v) => v.toString()}
            period={primaryLabel}
            onPeriodChange={handlePrimaryPreset}
          />
        </div>
      </div>

      <div className="row g-4 align-items-stretch">
        <div className="col-12 col-xl-3-5 d-flex flex-column" style={{ maxHeight: 340 }}>
          <TopProductsTable products={topProducts} />
        </div>
        <div className="col-12 col-xl-3-5 d-flex flex-column" style={{ maxHeight: 340 }}>
          <SalesByCategoryCard totalRevenue={totalRevenue} />
        </div>
        <div className="col-12 col-xl-5 d-flex flex-column" style={{ maxHeight: 340 }}>
          <RecentOrdersTable orders={recentOrders} />
        </div>
      </div>

      <p className="sa-footer-note">All dates and times are shown in your local timezone.</p>
    </div>
  );
}
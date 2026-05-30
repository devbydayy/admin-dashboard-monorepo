"use client";

import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import RecentOrders from "@/components/tables/RecentOrders";
import LiveActivity from "@/components/activity/LiveActivity";
import TopProducts from "@/components/dashboard/TopProducts";
import TrafficSources from "@/components/dashboard/TrafficSources";
import { StatCard } from "@/components/ui/StatCard";
import { DollarSign, ShoppingBag, Users, TrendingUp, CalendarDays, ChevronDown } from "lucide-react";
import { useDashboardStats } from "@/hooks/useAnalytics";
import { useOrders } from "@/hooks/useOrders";
import { useAnalyticsSnapshots } from "@/hooks/useAnalytics";
import { useDateRange } from "@/contexts/DateRangeContext";
import { STATIC_TODAY } from "@/lib/constants";
import {
  buildOverviewChartData,
  sumMetric,
} from "@/lib/chartHelpers";
import dynamic from "next/dynamic";

const RevenueChart = dynamic(
  () => import("@/components/charts/RevenueChart"),
  {
    ssr: false,
    loading: () => (
      <div
        className="sa-card"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 320,
          padding: "16px 18px",
        }}
      >
        <div className="sa-skeleton" style={{ flex: 1, borderRadius: 8 }} />
      </div>
    ),
  }
);

const OrdersChart = dynamic(
  () => import("@/components/charts/OrdersChart"),
  {
    ssr: false,
    loading: () => (
      <div
        className="sa-card"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 320,
          padding: "16px 18px",
        }}
      >
        <div className="sa-skeleton" style={{ flex: 1, borderRadius: 8 }} />
      </div>
    ),
  }
);

export default function OverviewPage() {

  const {
    startDate,
    endDate,
    datePreset,
    setStartDate,
    setEndDate,
    setDatePreset,
  } = useDateRange();

  const pickerRef = useRef<HTMLDivElement>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node)
      ) {
        setShowDatePicker(false);
      }
    }
    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDatePicker]);

  const { data: overviewStats, isLoading: statsLoading } = useDashboardStats();
  const { data: allOrders, isLoading: ordersLoading } = useOrders();
  const { data: snapshots } = useAnalyticsSnapshots("daily", 90);

  const revenueChartData = useMemo(
    () => buildOverviewChartData(snapshots, allOrders, startDate, endDate, "revenue"),
    [snapshots, allOrders, startDate, endDate]
  );

  const ordersChartData = useMemo(
    () => buildOverviewChartData(snapshots, allOrders, startDate, endDate, "orders"),
    [snapshots, allOrders, startDate, endDate]
  );

  const recentOrders = allOrders?.slice(0, 5) ?? [];

  const applyPreset = useCallback(
    (preset: string) => {
      const now = new Date(STATIC_TODAY);
      let start = new Date(now);
      switch (preset) {
        case "Today":
          start = new Date(now);
          break;
        case "This Week":
          start.setDate(now.getDate() - 6);
          break;
        case "This Month":
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "Last 30 Days":
          start.setDate(now.getDate() - 29);
          break;
        default:
          start.setDate(now.getDate() - 6);
      }
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(now.toISOString().split("T")[0]);
      setDatePreset(preset);
      setShowDatePicker(false);
    },
    [setStartDate, setEndDate, setDatePreset]
  );

  const formatRange = () => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const opts: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return `${s.toLocaleDateString("en-US", opts)} - ${e.toLocaleDateString("en-US", opts)}`;
  };

  const primaryDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24);
  const prevEndDate = new Date(new Date(startDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const prevStartDate = new Date(new Date(prevEndDate).getTime() - primaryDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const primaryRevenue = useMemo(
    () => sumMetric(snapshots, allOrders, startDate, endDate, "revenue"),
    [snapshots, allOrders, startDate, endDate]
  );
  const prevRevenue = useMemo(
    () => sumMetric(snapshots, allOrders, prevStartDate, prevEndDate, "revenue"),
    [snapshots, allOrders, prevStartDate, prevEndDate]
  );
  const primaryOrders = useMemo(
    () => sumMetric(snapshots, allOrders, startDate, endDate, "orders"),
    [snapshots, allOrders, startDate, endDate]
  );
  const prevOrders = useMemo(
    () => sumMetric(snapshots, allOrders, prevStartDate, prevEndDate, "orders"),
    [snapshots, allOrders, prevStartDate, prevEndDate]
  );

  const revenueTrend = prevRevenue > 0 ? (((primaryRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1) + "%" : "+12.5%";
  const revenueTrendUp = prevRevenue > 0 ? primaryRevenue >= prevRevenue : true;
  const ordersTrend = prevOrders > 0 ? (((primaryOrders - prevOrders) / prevOrders) * 100).toFixed(1) + "%" : "+8.2%";
  const ordersTrendUp = prevOrders > 0 ? primaryOrders >= prevOrders : true;

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: "1.375rem", color: "var(--sa-text-primary)" }}>
            Welcome back
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: "0.8125rem", color: "var(--sa-text-secondary)" }}>
            Welcome back, Alex! Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>

        <div ref={pickerRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="sa-datepicker-btn"
          >
            <CalendarDays size={15} color="var(--sa-text-muted)" />
            <span>{formatRange()}</span>
            <ChevronDown size={14} color="var(--sa-text-muted)" />
          </button>

          {showDatePicker && (
            <div className="sa-datepicker-dropdown sa-datepicker-dropdown-right">
              <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                {["Today", "This Week", "This Month", "Last 30 Days"].map((p) => (
                  <button
                    key={p}
                    onClick={() => applyPreset(p)}
                    className={`sa-preset-pill${datePreset === p ? " active" : ""}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="sa-preset-pill"
                >
                  Custom Range
                </button>
              </div>
              <div className="d-flex align-items-center justify-content-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setDatePreset("Custom");
                  }}
                  className="sa-date-input"
                />
                <span className="text-muted">–</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setDatePreset("Custom");
                  }}
                  className="sa-date-input"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Revenue"
            value={`$${(overviewStats?.revenue ?? 24780.5).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            trend={revenueTrend}
            trendUp={revenueTrendUp}
            icon={<DollarSign size={20} color="var(--sa-indigo)" />}
            iconBg="var(--sa-indigo-100)"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Orders"
            value={(overviewStats?.orders ?? 1248).toLocaleString()}
            trend={ordersTrend}
            trendUp={ordersTrendUp}
            icon={<ShoppingBag size={20} color="var(--sa-blue)" />}
            iconBg="var(--sa-blue-100)"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Customers"
            value={(overviewStats?.customers ?? 8542).toLocaleString()}
            trend="+8.2%"
            trendUp={true}
            icon={<Users size={20} color="var(--sa-green)" />}
            iconBg="var(--sa-green-100)"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Conversion Rate"
            value={`${(overviewStats?.conversionRate ?? 3.24).toFixed(2)}%`}
            trend="-2.4%"
            trendUp={false}
            icon={<TrendingUp size={20} color="var(--sa-rose)" />}
            iconBg="var(--sa-rose-100)"
          />
        </div>
      </div>

      <div className="row g-4 align-items-stretch">
        <div className="col-12 col-xl-5 d-flex flex-column">
          <RevenueChart
            data={revenueChartData}
            period={datePreset}
            onPeriodChange={applyPreset}
          />
        </div>
        <div className="col-12 col-xl-4 d-flex flex-column">
          <OrdersChart
            data={ordersChartData}
            period={datePreset}
            onPeriodChange={applyPreset}
          />
        </div>
        <div className="col-12 col-xl-3 d-flex flex-column">
          <TopProducts data={overviewStats?.topProducts} loading={statsLoading} />
        </div>
      </div>

      <div className="row g-4 align-items-stretch">
        <div className="col-12 col-xl-5 d-flex flex-column">
          <RecentOrders orders={recentOrders} loading={ordersLoading} />
        </div>
        <div className="col-12 col-xl-4 d-flex flex-column">
          <LiveActivity />
        </div>
        <div className="col-12 col-xl-3 d-flex flex-column">
          <TrafficSources />
        </div>
      </div>
    </div>
  );
}
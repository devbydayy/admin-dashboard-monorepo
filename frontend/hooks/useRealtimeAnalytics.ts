"use client"

import { useEffect, useState } from "react";
import { getSocket, connectSocket, joinAdminRoom } from "@/lib/socket";

interface AnalyticsUpdate {
  period: string;
  timestamp: string;
  stats: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    newCustomers: number;
  };
}

export const useRealtimeAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsUpdate | null>(null);

  useEffect(() => {
    connectSocket();
    joinAdminRoom();

    const socket = getSocket();

    const handleAnalyticsUpdate = (data: AnalyticsUpdate) => {
      setAnalytics(data);
    };

    socket.on("analytics-update", handleAnalyticsUpdate);

    return () => {
      socket.off("analytics-update", handleAnalyticsUpdate);
    };
  }, []);

  return analytics;
};

export const useRealtimeStats = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    currentOrders: 0,
    recentSales: 0,
  });

  useEffect(() => {
    connectSocket();
    joinAdminRoom();

    const socket = getSocket();

    const handleStatsUpdate = (data: typeof stats) => {
      setStats(data);
    };

    socket.on("stats-update", handleStatsUpdate);

    return () => {
      socket.off("stats-update", handleStatsUpdate);
    };
  }, []);

  return stats;
};

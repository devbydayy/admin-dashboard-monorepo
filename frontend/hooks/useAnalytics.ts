import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/analytics.api";
import type {
  OverviewData,
  SalesReport,
} from "@/types/analytics.types";
import { apiClient } from "@/lib/api/client";

export const useDashboardStats = () => {
  return useQuery<OverviewData>({
    queryKey: ["analytics", "overview"],
    queryFn: () => analyticsApi.getOverview(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSalesReport = (startDate: string, endDate: string) => {
  return useQuery<SalesReport>({
    queryKey: ["analytics", "sales", startDate, endDate],
    queryFn: () => analyticsApi.getSalesReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 15 * 60 * 1000,
  });
};

  export const useAnalyticsSnapshots = (period: string = "daily", limit: number = 30) => {
    return useQuery({
      queryKey: ["analytics", "snapshots", period, limit],
      queryFn: async () => {
        const response = await apiClient.get(
          `/analytics/snapshots?period=${period}&limit=${limit}`
        );
        return response.data.data;
      },
      staleTime: 15 * 60 * 1000,
    });
  };
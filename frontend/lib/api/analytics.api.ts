import { apiClient } from "./client";
import type { OverviewData, SalesReport } from "@/types/analytics.types"

export const analyticsApi = {
  getOverview: async (): Promise<OverviewData> => {
    const response = await apiClient.get("/analytics/overview");
    return response.data.data;
  },
  
  getSalesReport: async (startDate: string, endDate: string): Promise<SalesReport> => {
    const response = await apiClient.get(`/analytics/sales-report?startDate=${startDate}&endDate=${endDate}`);
    return response.data.data;
  },

  getSnapshots: async (period: string, limit: number) => {
    const response = await apiClient.get(
      `/analytics/snapshots?period=${period}&limit=${limit}`
    );
    return response.data.data;
  },
};

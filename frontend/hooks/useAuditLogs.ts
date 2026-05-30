import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export const useAuditLogs = (params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ["auditLogs", params],
    queryFn: async () => {
      const response = await apiClient.get("/audit-logs", { params });
      return response.data.data;
    },
  });
};
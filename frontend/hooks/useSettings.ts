import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export interface SiteSettings {
  id: string;
  siteName: string;
  supportEmail: string;
  currency: string;
  timezone: string;
  notifications: {
    newOrder: boolean;
    lowStock: boolean;
    newCustomer: boolean;
    paymentReceived: boolean;
  };
}

export const useSettings = () => {
  return useQuery<SiteSettings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await apiClient.get("/settings");
      return response.data.data;
    },
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SiteSettings>) => apiClient.put("/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};
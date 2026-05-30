import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export const useLowStockAlerts = (threshold = 10) => {
  return useQuery({
    queryKey: ["inventory", "alerts", threshold],
    queryFn: async () => {
      const response = await apiClient.get(`/inventory/alerts?threshold=${threshold}`);
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useAdjustStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, operation, amount }: { productId: string; operation: string; amount: number }) => {
      const response = await apiClient.patch(`/inventory/products/${productId}/stock`, { operation, amount });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "alerts"] });
    },
  });
};
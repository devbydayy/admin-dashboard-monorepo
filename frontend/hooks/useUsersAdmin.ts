import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export interface UserItem {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  lastActive: string;
  avatar?: string;
}

export const useUsersList = () => {
  return useQuery<UserItem[]>({
    queryKey: ["users", "list"],
    queryFn: async () => {
      const response = await apiClient.get("/users");
      return response.data.data;
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<UserItem> }) => {
      const response = await apiClient.put(`/users/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
    },
  });
};
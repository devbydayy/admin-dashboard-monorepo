import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export type Category = {
  id: string;
  name: string;
  slug: string;
  type: string;
  _count?: {
    products: number;
  };
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get("/categories");
  return response.data.data;
};

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}
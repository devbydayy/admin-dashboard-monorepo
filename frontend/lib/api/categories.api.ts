
import { apiClient } from "./client";
import type { Category } from "@/types/category.types"

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get("/categories");
    return response.data.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    const response = await apiClient.post("/categories", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};

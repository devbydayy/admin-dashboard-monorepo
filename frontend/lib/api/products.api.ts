import { apiClient } from "./client";
import type { Product } from "@/types/product.types"
import type { CreateProductData, UpdateProductData } from "@/types/product.types";

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const res = await apiClient.get("/products");
    return res.data.data;
  },

  getById: async (id: string): Promise<Product> => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data.data;
  },

  create: async (data: CreateProductData): Promise<Product> => {
    const res = await apiClient.post("/products", data);
    return res.data.data;
  },

  update: async (id: string, data: UpdateProductData): Promise<Product> => {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("image", file);
    const res = await apiClient.post("/upload/product-image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data.url as string;
  },
};
import { apiClient } from "./client";
import type { Order, OrderItem, CreateOrderData } from "@/types/order.types";
export type { Order, OrderItem, CreateOrderData };

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get("/orders");
    return response.data.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data.data;
  },

  create: async (data: CreateOrderData): Promise<Order> => {
    const response = await apiClient.post("/orders", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Order>): Promise<Order> => {
    const response = await apiClient.put(`/orders/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/orders/${id}`);
  },
};
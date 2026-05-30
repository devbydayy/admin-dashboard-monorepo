import { apiClient } from "./client";
import type { Customer, OrderSummary } from "@/types/customer.types";

export type { Customer, OrderSummary };

export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    const response = await apiClient.get("/customers");
    return response.data.data;
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Customer>): Promise<Customer> => {
    const response = await apiClient.post("/customers", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    const response = await apiClient.put(`/customers/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },
};
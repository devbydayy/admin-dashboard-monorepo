import { apiClient } from "./client";
import type { LoginData, RegisterData, AuthResponse, AuthUser } from "@/types/auth.types";

export type { LoginData, RegisterData, AuthResponse, AuthUser };

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  getProfile: async (): Promise<AuthUser> => {
    const response = await apiClient.get("/auth/profile");
    return response.data.data;
  },

  updateProfile: async (data: Partial<AuthUser>): Promise<AuthUser> => {
    const response = await apiClient.put("/auth/profile", data);
    return response.data.data;
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    document.cookie = "auth_token=; path=/; max-age=0";
  },
};
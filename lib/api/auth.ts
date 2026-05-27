import { apiClient } from "./client";
import type { User } from "@/types";

export interface LoginInput { email: string; password: string; }
export interface RegisterInput { name: string; email: string; password: string; eventType?: string; }
export interface AuthResponse { user: User; token: string; }

export const authApi = {
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const { data } = await apiClient.post("/auth/login", input);
    return data;
  },
  register: async (input: RegisterInput): Promise<AuthResponse> => {
    const { data } = await apiClient.post("/auth/register", input);
    return data;
  },
  me: async (): Promise<User> => {
    const { data } = await apiClient.get("/auth/me");
    return data;
  },
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
    sessionStorage.removeItem("invite_token");
  },
};

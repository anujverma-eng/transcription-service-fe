// src/api/adminApi.ts
import { apiClient } from "./apiClient";

export async function getUsers(params: { page: number; limit: number; query?: string }) {
  const res = await apiClient.get("/admin/users/search", { params });
  return res.data;
}

export async function blockUser(userId: string) {
  const res = await apiClient.patch(`/admin/users/block/${userId}`);
  return res.data;
}

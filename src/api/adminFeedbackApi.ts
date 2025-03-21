import { apiClient } from "./apiClient";

export async function getAdminFeedback(params: { page: number; limit: number }) {
  const res = await apiClient.get("/admin/feedback/search", { params });
  return res.data;
}

export async function selectFeedback(feedbackId: string, data: { adminSelected: boolean }) {
  const res = await apiClient.patch(`/admin/feedback/select/${feedbackId}`, data);
  return res.data;
}

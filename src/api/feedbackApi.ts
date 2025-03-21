import { apiClient } from "./apiClient";

export async function createFeedback(data: { rating: number; review: string }) {
  const res = await apiClient.post("/feedback", data);
  return res.data;
}

export async function getMyFeedback() {
  const res = await apiClient.get("/feedback/me");
  return res.data;
}

export async function deleteFeedback() {
  const res = await apiClient.delete("/feedback/me");
  return res.data;
}

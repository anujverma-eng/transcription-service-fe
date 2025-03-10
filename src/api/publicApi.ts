// src/api/publicApi.ts

import { apiClient } from "./apiClient";

export interface Plan {
  _id: string;
  name: string;
  description?: string;
  totalLimit: number;
  price: number;
  currency: string;
  isActive: boolean;
  isPaid: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Feedback {
  userName: string;
  _id: string;
  userId: string;
  rating: number;
  review: string;
  adminSelected: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// fetch all plans
export async function getPublicPlans(): Promise<Plan[]> {
  const res = await apiClient.get("/admin/plans/get/plans");
  return res.data?.data || res.data;
}

// fetch public feedback
export async function getPublicFeedback(): Promise<Feedback[]> {
  const res = await apiClient.get("/feedback/public");
  return res.data?.data || res.data; 
}

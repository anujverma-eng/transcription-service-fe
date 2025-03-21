// src/api/paymentApi.ts
import { apiClient } from './apiClient';

export async function initiatePayment(data: { planId: string }): Promise<any> {
  const res = await apiClient.post('/payments/initiate', data);
  return res.data;
}

export async function verifyPayment(data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<any> {
  const res = await apiClient.post('/payments/verify', data);
  return res.data;
}

export async function paymentHistory(): Promise<any> {
  const res = await apiClient.get('/payments/history');
  return res.data;
}

// src/api/authApi.ts
import { apiClient } from './apiClient';
import {
  SignUpDto,
  LoginDto,
  AuthResponse,
  GenericResponse,
  ForgotPasswordDto,
  ResetPasswordDto,
  ProfileResponse,
} from '@/features/auth/authTypes';

export async function signUp(data: SignUpDto): Promise<AuthResponse> {
  const res = await apiClient.post('/auth/sign-up', data);
  return res.data; // server might return { message, user? }
}

export async function login(data: LoginDto): Promise<AuthResponse> {
  const res = await apiClient.post('/auth/login', data);
  return res.data;
}

export async function logout(): Promise<GenericResponse> {
    const res = await apiClient.post('/auth/logout');
    return res.data;
}

export async function forgotPassword(data: ForgotPasswordDto): Promise<GenericResponse> {
  const res = await apiClient.post('/auth/forgot-password', data);
  return res.data;
}

export async function resetPassword(data: ResetPasswordDto): Promise<AuthResponse> {
  const res = await apiClient.post('/auth/reset-password', data);
  return res.data;
}

export async function getProfile(): Promise<ProfileResponse> {
  const res = await apiClient.get('/auth/profile');
  const top = res.data;
  const payload = top.data;
  return {
    user: payload.user,
    subscription: payload.subscription,
  };
}

export async function refreshTokens(): Promise<any> {
  await apiClient.post('/auth/refresh')
}

// src/api/apiClient.ts
import axios, { AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true, // so NestJS sets httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}[] = [];

function processQueue(error: any, success: boolean) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(prom.config);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Skip token refresh for auth endpoints
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');
    
    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        })
          .then((reqConfig) => apiClient(reqConfig))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // call /auth/refresh
        await apiClient.post('/auth/refresh');

        isRefreshing = false;
        processQueue(null, true);

        // re-run the original request
        return apiClient(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        processQueue(refreshErr, false);
        // We might dispatch a forced logout or so
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

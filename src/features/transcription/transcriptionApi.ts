// src/features/transcription/transcriptionApi.ts
import { apiClient } from "@/api/apiClient";

// ----------------- Types -------------------
export enum TranscriptionStatus {
  QUEUED = "QUEUED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface Usage {
  totalLimit: number;
  totalUsedMinutes: number;
  remainingMinutes: number;
}

export interface TranscriptionJob {
  _id: string;
  fileName?: string;
  durationInSeconds: number;
  durationText?: string;
  usageMinutes: number;
  status: TranscriptionStatus;
  createdAt?: string;
  audioFileKey?: string;
  audioFileLink?: string | null;
  transcriptionFileLink?: string | null;
  transcriptionText?: string;
  error?: string | null;
}

export interface UsageStats {
  date: string;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  minutesDeducted: number;
  minutesRefunded: number;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// The backend’s unified response structure
interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T | null;
  dataFrom: string;
  error: null | {
    message: string;
    status: number;
    details?: any;
  };
  pagination?: PaginationData;
}

// --------------- API Functions ----------------

// 1) GET /transcription/usage
export async function fetchUsageApi(): Promise<Usage> {
  const res = await apiClient.get<ApiResponse<Usage>>("/transcription/usage");
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.error?.message || "Failed to fetch usage");
  }
  return res.data.data;
}

// 2) GET /transcription/search?page=1&limit=10&query=...
// Might return an array of jobs + optional pagination
export async function fetchJobsApi(
  page: number,
  limit: number,
  query: string
): Promise<{ jobs: TranscriptionJob[]; pagination?: PaginationData }> {
  const url = `/transcription/search?page=${page}&limit=${limit}&query=${encodeURIComponent(query)}`;
  const res = await apiClient.get<ApiResponse<TranscriptionJob[]>>(url);

  if (!res.data.success) {
    throw new Error(res.data.error?.message || "Failed to fetch jobs");
  }

  const jobs = (res.data.data as TranscriptionJob[]) || [];
  const pagination = res.data.pagination; // if the backend sets it
  return { jobs, pagination };
}

// 3) GET /transcription/job/:jobId
// returns { status, audioFileLink, transcriptionFileLink } (unless COMPLETED)
export async function getJobDetailApi(jobId: string): Promise<{
  jobId: string;
  status: string;
  audioFileLink?: string;
  transcriptionFileLink?: string;
}> {
  const res = await apiClient.get<ApiResponse<any>>(`/transcription/job/${jobId}`);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.error?.message || "Failed to get job detail");
  }

  // Merge jobId into the returned data
  return { jobId, ...res.data.data };
}

// 4) POST /transcription/presign => { presignedUrl, s3Key }
export interface PresignResponse {
  presignedUrl: string;
  s3Key: string;
}
export async function presignAudioApi(fileName: string, duration: number, mimeType: string): Promise<PresignResponse> {
  const body = { fileName, duration, mimeType };
  const res = await apiClient.post<ApiResponse<PresignResponse>>("/transcription/presign", body);

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.error?.message || "Presign request failed");
  }
  return res.data.data;
}

// 5) POST /transcription/queue-job => { newJob, priority, submissionIndex, jobId }
export interface QueueJobParams {
  s3Key: string;
  duration: number;
  fileName: string;
  sourceLanguage: string;
  transcriptLanguage: string;
}
export async function queueTranscriptionJobApi(params: QueueJobParams): Promise<{
  message: string;
  newJob: TranscriptionJob;
  priority: number;
  submissionIndex: number;
  jobId: string;
}> {
  const body = {
    audioFileKey: params.s3Key,
    duration: params.duration,
    fileName: params.fileName,
    sourceLanguage: params.sourceLanguage,
    transcriptLanguage: params.transcriptLanguage,
  };
  const res = await apiClient.post<
    ApiResponse<{
      message: string;
      newJob: TranscriptionJob;
      priority: number;
      submissionIndex: number;
      jobId: string;
    }>
  >("/transcription/queue-job", body);

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.error?.message || "Queue job failed");
  }

  return res.data.data;
}

// 6) DELETE /transcription/:jobId (if implemented)
export async function deleteJobApi(jobId: string): Promise<{ jobId: string }> {
  // If your backend has an actual DELETE endpoint:
  // const res = await apiClient.delete<ApiResponse<{ jobId: string }>>(`/transcription/${jobId}`);
  // if (!res.data.success || !res.data.data) {
  //   throw new Error(res.data.error?.message || "Failed to delete job");
  // }
  // return res.data.data;
  return { jobId }; // Currently a stub if no real endpoint
}

export async function getUsageStats(): Promise<UsageStats[]> {
  const res = await apiClient.get<ApiResponse<UsageStats[]>>("/transcription/usage/stats");
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.error?.message || "Failed to fetch usage");
  }
  return res.data.data;
}

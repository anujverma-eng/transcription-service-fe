// src/features/transcription/transcriptionSlice.ts
import {
  fetchUsageApi,
  fetchJobsApi,
  getJobDetailApi,
  presignAudioApi,
  queueTranscriptionJobApi,
  deleteJobApi,
  TranscriptionJob,
  Usage,
  PaginationData,
  getUsageStats,
  UsageStats,
} from "./transcriptionApi";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

interface TranscriptionState {
  usage: Usage | null;
  jobs: TranscriptionJob[];
  selectedJob: TranscriptionJob | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: PaginationData | null; // Store pagination from server
  usageStats: UsageStats[] | null;
}

const initialState: TranscriptionState = {
  usage: null,
  jobs: [],
  selectedJob: null,
  status: "idle",
  error: null,
  pagination: null,
  usageStats: null,
};

// 1) fetchUsage
export const fetchUsage = createAsyncThunk("transcription/fetchUsage", async (_, thunkAPI) => {
  try {
    const usage = await fetchUsageApi();
    return usage;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Failed to fetch usage");
  }
});

export const fetchUsageStats = createAsyncThunk("transcription/fetchUsageStats", async (_, thunkAPI) => {
  try {
    const stats = await getUsageStats();
    return stats;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Failed to fetch usage Statistics");
  }
});

// 2) fetchJobs => pass { page, limit, query }
export const fetchJobs = createAsyncThunk(
  "transcription/fetchJobs",
  async ({ page, limit, query }: { page: number; limit: number; query: string }, thunkAPI) => {
    try {
      const { jobs, pagination } = await fetchJobsApi(page, limit, query);
      // Return them as payload
      return { jobs, pagination };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch jobs");
    }
  }
);

// 3) getJobDetail
export const getJobDetail = createAsyncThunk("transcription/getJobDetail", async (jobId: string, thunkAPI) => {
  try {
    const data = await getJobDetailApi(jobId); // => { jobId, status, audioFileLink, ...}
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Failed to get job detail");
  }
});

// 4) presignAudio
export const presignAudio = createAsyncThunk(
  "transcription/presignAudio",
  async ({ fileName, duration, mimeType }: { fileName: string; duration: number; mimeType: string }, thunkAPI) => {
    try {
      return await presignAudioApi(fileName, duration, mimeType);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Presign request failed");
    }
  }
);

// 5) queueTranscriptionJob
export const queueTranscriptionJob = createAsyncThunk(
  "transcription/queueTranscriptionJob",
  async (
    {
      s3Key,
      duration,
      fileName,
      sourceLanguage,
      transcriptLanguage,
    }: { s3Key: string; duration: number; fileName: string; sourceLanguage: string; transcriptLanguage: string },
    thunkAPI
  ) => {
    try {
      const data = { s3Key, duration, fileName, sourceLanguage, transcriptLanguage }
      return await queueTranscriptionJobApi(data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Queue job failed");
    }
  }
);

// 6) deleteJob
export const deleteJob = createAsyncThunk("transcription/deleteJob", async (jobId: string, thunkAPI) => {
  try {
    const result = await deleteJobApi(jobId); // { jobId }
    return result;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Delete job failed");
  }
});

const transcriptionSlice = createSlice({
  name: "transcription",
  initialState,
  reducers: {
    setSelectedJob(state, action: PayloadAction<TranscriptionJob | null>) {
      state.selectedJob = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchUsage
    builder
      .addCase(fetchUsage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsage.fulfilled, (state, action: PayloadAction<Usage>) => {
        state.status = "succeeded";
        state.usage = action.payload;
      })
      .addCase(fetchUsage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // fetchUsageStatistics
    builder
      .addCase(fetchUsageStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsageStats.fulfilled, (state, action: PayloadAction<UsageStats[]>) => {
        state.status = "succeeded";
        state.usageStats = action.payload;
      })
      .addCase(fetchUsageStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // fetchJobs
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchJobs.fulfilled,
        (state, action: PayloadAction<{ jobs: TranscriptionJob[]; pagination?: PaginationData }>) => {
          state.status = "succeeded";
          state.jobs = action.payload.jobs;
          state.pagination = action.payload.pagination || null;
        }
      )
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // getJobDetail
    builder
      .addCase(getJobDetail.fulfilled, (state, action) => {
        // const { jobId } = action.payload as any;
        // Merge partial updates into the jobs array
        // const idx = state.jobs.findIndex((j) => j._id === jobId);
        state.selectedJob = action.payload as any;
        // if (idx >= 0) {
        //   const updatedJob = { ...state.jobs[idx], ...rest };
        //   state.jobs[idx] = updatedJob;
        //   if (state.selectedJob && state.selectedJob._id === jobId) {
        //     state.selectedJob = updatedJob;
        //   }
        // }
      })
      .addCase(getJobDetail.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // presignAudio
    builder.addCase(presignAudio.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // queueTranscriptionJob
    builder
      .addCase(queueTranscriptionJob.fulfilled, (state, action) => {
        // action.payload => { newJob, ... }
        const { newJob } = action.payload as any;
        if (newJob) {
          // Insert new job at the top
          state.jobs.unshift(newJob);
        }
      })
      .addCase(queueTranscriptionJob.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // deleteJob
    builder
      .addCase(deleteJob.fulfilled, (state, action) => {
        const { jobId } = action.payload;
        state.jobs = state.jobs.filter((j) => j._id !== jobId);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedJob } = transcriptionSlice.actions;
export default transcriptionSlice.reducer;

// ------------------- Selectors -------------------
export const selectUsage = (state: RootState) => state.transcription.usage;
export const selectUsageStats = (state: RootState) => state.transcription.usageStats;
export const selectJobs = (state: RootState) => state.transcription.jobs;
export const selectPagination = (state: RootState) => state.transcription.pagination;
export const selectSelectedJob = (state: RootState) => state.transcription.selectedJob;
export const selectTranscriptionStatus = (state: RootState) => state.transcription.status;
export const selectTranscriptionError = (state: RootState) => state.transcription.error;

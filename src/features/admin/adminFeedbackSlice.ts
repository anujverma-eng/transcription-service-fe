import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as adminFeedbackApi from "@/api/adminFeedbackApi";

export const getAdminFeedbackThunk = createAsyncThunk(
  "adminFeedback/getAdminFeedback",
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await adminFeedbackApi.getAdminFeedback(params);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const selectFeedbackThunk = createAsyncThunk(
  "adminFeedback/selectFeedback",
  async (
    { feedbackId, adminSelected }: { feedbackId: string; adminSelected: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminFeedbackApi.selectFeedback(feedbackId, { adminSelected });
      return { feedbackId, data: response };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

interface Feedback {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  review: string;
  isDeleted: boolean;
  adminSelected: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AdminFeedbackState {
  feedbacks: Feedback[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AdminFeedbackState = {
  feedbacks: [],
  pagination: null,
  status: "idle",
  error: null,
};

const adminFeedbackSlice = createSlice({
  name: "adminFeedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminFeedbackThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAdminFeedbackThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feedbacks = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAdminFeedbackThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(selectFeedbackThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(selectFeedbackThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { feedbackId } = action.payload;
        const fb = state.feedbacks.find((f) => f._id === feedbackId);
        if (fb) {
          fb.adminSelected = true;
        }
      })
      .addCase(selectFeedbackThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default adminFeedbackSlice.reducer;

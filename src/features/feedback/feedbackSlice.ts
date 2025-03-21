import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as feedbackApi from "@/api/feedbackApi";

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
}

interface FeedbackState {
  feedback: Feedback | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FeedbackState = {
  feedback: null,
  status: "idle",
  error: null,
};

export const createFeedbackThunk = createAsyncThunk(
  "feedback/createFeedback",
  async (data: { rating: number; review: string }, { rejectWithValue }) => {
    try {
      const response = await feedbackApi.createFeedback(data);
      return response.data || response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getMyFeedbackThunk = createAsyncThunk(
  "feedback/getMyFeedback",
  async (_, { rejectWithValue }) => {
    try {
      const response = await feedbackApi.getMyFeedback();
      return response.data || response;
    } catch (err: any) {
      // If backend sends a 404, treat it as no feedback.
      if (err.response && err.response.status === 404) {
        return null;
      }
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteFeedbackThunk = createAsyncThunk(
  "feedback/deleteFeedback",
  async (_, { rejectWithValue }) => {
    try {
      const response = await feedbackApi.deleteFeedback();
      return response.data || response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    clearFeedback(state) {
      state.feedback = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyFeedbackThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getMyFeedbackThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feedback = action.payload; // may be null if no feedback found
      })
      .addCase(getMyFeedbackThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createFeedbackThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createFeedbackThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feedback = action.payload;
      })
      .addCase(createFeedbackThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteFeedbackThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteFeedbackThunk.fulfilled, (state) => {
        state.status = "succeeded";
        state.feedback = null;
      })
      .addCase(deleteFeedbackThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;

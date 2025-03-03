// src/features/public/publicSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as publicApi from "@/api/publicApi";

export interface PublicState {
  plans: publicApi.Plan[];
  feedback: publicApi.Feedback[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PublicState = {
  plans: [],
  feedback: [],
  status: "idle",
  error: null,
};

// fetch public plans
export const fetchPublicPlans = createAsyncThunk(
  "public/fetchPublicPlans",
  async (_, thunkAPI) => {
    try {
      const plans = await publicApi.getPublicPlans();
      return plans;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message?.message || err.message || "Failed to get plans");
    }
  }
);

// fetch public feedback
export const fetchPublicFeedback = createAsyncThunk(
  "public/fetchPublicFeedback",
  async (_, thunkAPI) => {
    try {
      const feedback = await publicApi.getPublicFeedback();
      return feedback;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message?.message || err.message || "Failed to get feedback");
    }
  }
);

const publicSlice = createSlice({
  name: "public",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchPublicPlans
      .addCase(fetchPublicPlans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPublicPlans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans = action.payload;
      })
      .addCase(fetchPublicPlans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // fetchPublicFeedback
      .addCase(fetchPublicFeedback.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPublicFeedback.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feedback = action.payload;
      })
      .addCase(fetchPublicFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default publicSlice.reducer;

// src/features/admin/adminSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as adminApi from "@/api/adminApi";

export const getUsersThunk = createAsyncThunk(
  "admin/getUsers",
  async (params: { page: number; limit: number; query?: string }, { rejectWithValue }) => {
    try {
      const response = await adminApi.getUsers(params);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const blockUserThunk = createAsyncThunk(
  "admin/blockUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await adminApi.blockUser(userId);
      return { userId, data: response };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

interface AdminUser {
  _id: string;
  email: string;
  name: string;
  isActive: boolean;
  isBlocked: boolean;
  subscription: {
    _id: string;
    planId: { _id: string; name: string };
    totalLimit: number;
    totalUsedMinutes: number;
    isPaid: boolean;
    startDate: string;
  };
  usage: {
    _id: string | null;
    totalJobs: number;
    completedJobs: number;
    failedJobs: number;
    totalMinutesUsed: number;
  };
  payments: {
    recent: Array<{
      _id: string;
      razorpayOrderId: string;
      amount: number;
      status: string;
      userId: string;
      planId: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
      razorpayPaymentId: string;
      razorpaySignature: string;
    }>;
    total: number;
  };
}

interface AdminState {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  pagination: null,
  status: "idle",
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUsersThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getUsersThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(blockUserThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(blockUserThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        const userId = action.payload.userId;
        const user = state.users.find((u) => u._id === userId);
        if (user) {
          user.isBlocked = true;
        }
      })
      .addCase(blockUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default adminSlice.reducer;

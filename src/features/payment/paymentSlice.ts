// src/features/payment/paymentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as paymentApi from '@/api/paymentApi';

interface PaymentState {
  orderId: string | null;
  amount: number;
  currency: string;
  key: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  history: any[];
}

const initialState: PaymentState = {
  orderId: null,
  amount: 0,
  currency: 'INR',
  key: '',
  status: 'idle',
  error: null,
  history: [],
};

export const initiatePayment = createAsyncThunk(
  'payment/initiatePayment',
  async (planId: string, { rejectWithValue }) => {
    try {
      const data = await paymentApi.initiatePayment({ planId });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async (paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }, { rejectWithValue }) => {
    try {
      const data = await paymentApi.verifyPayment(paymentData);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const paymentHistory = createAsyncThunk(
  'payment/paymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      const data = await paymentApi.paymentHistory();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentState(state) {
      state.orderId = null;
      state.amount = 0;
      state.currency = 'INR';
      state.key = '';
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orderId = action.payload.orderId;
        state.amount = action.payload.amount;
        state.currency = action.payload.currency;
        state.key = action.payload.key;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(paymentHistory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(paymentHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.history = action.payload;
      })
      .addCase(paymentHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;

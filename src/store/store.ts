// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import publicReducer from '@/features/public/publicSlice';
import transcriptionReducer from '@/features/transcription/transcriptionSlice';
import paymentReducer from '@/features/payment/paymentSlice';
import feedbackReducer from '@/features/feedback/feedbackSlice';
import adminReducer from '@/features/admin/adminSlice';
import adminFeedbackReducer from '@/features/admin/adminFeedbackSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    public: publicReducer,
    transcription: transcriptionReducer,
    payment: paymentReducer,
    feedback: feedbackReducer,
    admin: adminReducer,
    adminFeedback: adminFeedbackReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

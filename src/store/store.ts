// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import publicReducer from '@/features/public/publicSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    public: publicReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

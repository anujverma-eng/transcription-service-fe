// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authApi from '@/api/authApi';
import {
  SignUpDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './authTypes';

interface User {
  id?: string;
  email?: string;
  role?: string;
  name?: string;
  subscriptionPlan?: string;
  isPaid?: boolean;
  totalLimit?: number;
  planId?: string;
}

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

// after user logs in with google, the server sets cookies => we call getProfile
export const completeGoogleAuth = createAsyncThunk(
  'auth/completeGoogleAuth',
  async (_, thunkAPI) => {
    try {
      const profile = await authApi.getProfile();
      return profile;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message?.message || err.message || 'Google Auth failed'
      );
    }
  }
);

// signUp => then getProfile
export const signUpUser = createAsyncThunk('auth/signUpUser', async (dto: SignUpDto, thunkAPI) => {
  try {
    await authApi.signUp(dto);
    const profile = await authApi.getProfile();
    return profile;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message?.message || err.message || 'Sign up failed');
  }
});

// login => then getProfile
export const loginUser = createAsyncThunk('auth/loginUser', async (dto: LoginDto, thunkAPI) => {
  try {
    await authApi.login(dto);
    const profile = await authApi.getProfile();
    return profile;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message?.message || err.message || 'Login failed');
  }
});

// forgot
export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (dto: ForgotPasswordDto, thunkAPI) => {
  try {
    const data = await authApi.forgotPassword(dto);
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message?.message || err.message || 'Forgot failed');
  }
});

// reset => then getProfile
export const resetPassword = createAsyncThunk('auth/resetPassword', async (dto: ResetPasswordDto, thunkAPI) => {
  try {
    await authApi.resetPassword(dto);
    const profile = await authApi.getProfile();
    return profile;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message?.message || err.message || 'Reset failed');
  }
});

// logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
  try {
    const resp = await authApi.logout();
    return resp; // { message: "..."}
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message?.message || err.message || 'Logout failed');
  }
});

// optional getProfile if you want a manual re-check
export const getProfile = createAsyncThunk('auth/getProfile', async (_, thunkAPI) => {
  try {
    const profile = await authApi.getProfile();
    return profile;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message?.message || err.message || 'Get profile failed');
  }
});

export const getRefreshTokens = createAsyncThunk('auth/refresh', async (_, thunkAPI) => {
  try {
    const profile = await authApi.refreshTokens()
    return profile;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message?.message || err.message || 'User Logged Out!!');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // signUpUser
    builder
      .addCase(signUpUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const { user, subscription } = action.payload;
        state.user = {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionPlan: subscription.isPaid ? 'paid' : 'free',
          isPaid: subscription.isPaid,
          totalLimit: subscription.totalLimit,
          planId: subscription?.planId,
        };
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const { user, subscription } = action.payload;
        state.user = {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionPlan: subscription.isPaid ? 'paid' : 'free',
          isPaid: subscription.isPaid,
          totalLimit: subscription.totalLimit,
          planId: subscription?.planId,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const { user, subscription } = action.payload;
        state.user = {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionPlan: subscription.isPaid ? 'paid' : 'free',
          isPaid: subscription.isPaid,
          totalLimit: subscription.totalLimit,
          planId: subscription?.planId,
        };
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // logout
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // completeGoogleAuth
      .addCase(completeGoogleAuth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(completeGoogleAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const { user, subscription } = action.payload;
        state.user = {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionPlan: subscription.isPaid ? 'paid' : 'free',
          isPaid: subscription.isPaid,
          totalLimit: subscription.totalLimit,
          planId: subscription?.planId,
        };
      })
      .addCase(completeGoogleAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // getProfile
      .addCase(getProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const { user, subscription } = action.payload;
        state.user = {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionPlan: subscription.isPaid ? 'paid' : 'free',
          isPaid: subscription.isPaid,
          totalLimit: subscription.totalLimit,
          planId: subscription?.planId,
        };
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(getRefreshTokens.rejected, (state, action)=> {
        state.status = 'failed';
        state.error = action.payload as string;
      })
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;

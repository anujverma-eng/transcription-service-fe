// src/features/auth/authTypes.ts
export interface SignUpDto {
  email: string;
  password: string;
  name?: string;
  organization?: string;
  phoneNumber?: string;
  country?: string;
}
export interface LoginDto {
  email: string;
  password: string;
}
export interface ForgotPasswordDto {
  email: string;
}
export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  message: string;
  user?: {
    id?: string;
    email: string;
    role?: string;
    name?: string;
    subscriptionPlan?: string;
  };
}

export interface GenericResponse {
  message: string;
}

export interface ProfileResponse {
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
  };
  subscription: {
    _id: string;
    isPaid: boolean;
    dailyLimit: number;
    endDate: string | null;
    // ...
  };
}

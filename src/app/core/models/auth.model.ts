export interface User {
  id: number;
  name: string;
  password?: string; 
  phone: string; 
  address?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PhoneResponse {
  token: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number;
  refreshToken?: string;
}

export interface LoginRequest {
  phone: string; 
  password: string;
}

export interface RegisterRequest {
  name: string;
  phone: string; 
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  success: boolean;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string; 
  address?: string;
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  token: string;
}
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
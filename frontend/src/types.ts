export interface User {
  id: string;
  name: string;
  regNo: string;
  email: string;
  department: string;
  isVerified: boolean;
}

export interface AuthResponse {
  message: string;
  user?: User;
  email?: string;
  needsVerification?: boolean;
  alreadyVerified?: boolean;
}

export interface RegisterDetails {
  name: string;
  regNo: string;
  email: string;
  department: string;
  password: string;
}

export interface RegisterForm extends RegisterDetails {
  confirmPassword: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface VerifyState {
  email?: string;
  message?: string;
}

export interface LoginState {
  verified?: boolean;
}

import { request } from "./client";
import type { AuthResponse, RegisterDetails } from "../types";

export function registerUser(details: RegisterDetails): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", "POST", details);
}

export function verifyOtp(email: string, otp: string): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/verify-otp", "POST", { email, otp });
}

export function resendOtp(email: string): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/resend-otp", "POST", { email });
}

export function loginUser(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", "POST", { email, password });
}

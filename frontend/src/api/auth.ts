import type { AuthResponse, RegisterDetails } from "../types";

// A failed request is thrown as this instead of a plain Error, so the
// screens can read the status code and the extra flags the backend sent.
export class ApiError extends Error {
  status: number;
  data: AuthResponse;

  constructor(message: string, status: number, data: AuthResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function post(path: string, body: object): Promise<AuthResponse> {
  const response: Response = await fetch("/api/auth" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data: AuthResponse;
  try {
    data = (await response.json()) as AuthResponse;
  } catch {
    data = { message: "The server sent something unreadable." };
  }

  if (!response.ok) {
    throw new ApiError(data.message || "Request failed.", response.status, data);
  }

  return data;
}

export function registerUser(details: RegisterDetails): Promise<AuthResponse> {
  return post("/register", details);
}

export function verifyOtp(email: string, otp: string): Promise<AuthResponse> {
  return post("/verify-otp", { email, otp });
}

export function resendOtp(email: string): Promise<AuthResponse> {
  return post("/resend-otp", { email });
}

export function loginUser(email: string, password: string): Promise<AuthResponse> {
  return post("/login", { email, password });
}

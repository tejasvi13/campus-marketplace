export const STORAGE_KEY: string = "campus_marketplace_user";

export class ApiError extends Error {
  status: number;
  data: Record<string, unknown>;

  constructor(message: string, status: number, data: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function currentUserId(): string {
  try {
    const raw: string | null = localStorage.getItem(STORAGE_KEY);
    if (!raw) return "";
    const parsed = JSON.parse(raw) as { id?: string };
    return parsed.id || "";
  } catch {
    return "";
  }
}

type Method = "GET" | "POST" | "PUT" | "DELETE";

export async function request<T>(path: string, method: Method = "GET", body?: object): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  const userId: string = currentUserId();
  if (userId) {
    headers["x-user-id"] = userId;
  }

  const response: Response = await fetch("/api" + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: Record<string, unknown>;
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    data = { message: "The server sent something unreadable." };
  }

  if (!response.ok) {
    const message: string =
      typeof data.message === "string" ? data.message : "Request failed.";
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

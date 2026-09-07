import { request } from "./client";
import type { ProfileEdit, ProfileResponse } from "../types";

export function getMyProfile(): Promise<ProfileResponse> {
  return request<ProfileResponse>("/users/me");
}

export function updateMyProfile(edit: ProfileEdit): Promise<ProfileResponse> {
  return request<ProfileResponse>("/users/me", "PUT", edit);
}

import { request } from "./client";
import type {
  BrowseFilters,
  ListingDraft,
  ListingResponse,
  ListingsResponse,
  MessageResponse,
} from "../types";

function toQuery(filters: BrowseFilters): string {
  const parts: string[] = [];

  if (filters.search.trim()) parts.push("search=" + encodeURIComponent(filters.search.trim()));
  if (filters.category) parts.push("category=" + filters.category);
  if (filters.type) parts.push("type=" + filters.type);
  if (filters.sort) parts.push("sort=" + filters.sort);

  return parts.length ? "?" + parts.join("&") : "";
}

export function browseListings(filters: BrowseFilters): Promise<ListingsResponse> {
  return request<ListingsResponse>("/listings" + toQuery(filters));
}

export function myListings(): Promise<ListingsResponse> {
  return request<ListingsResponse>("/listings/mine");
}

export function getListing(id: string): Promise<ListingResponse> {
  return request<ListingResponse>("/listings/" + id);
}

export function createListing(draft: ListingDraft): Promise<ListingResponse> {
  return request<ListingResponse>("/listings", "POST", draft);
}

export function updateListing(id: string, draft: ListingDraft): Promise<ListingResponse> {
  return request<ListingResponse>("/listings/" + id, "PUT", draft);
}

export function deleteListing(id: string): Promise<MessageResponse> {
  return request<MessageResponse>("/listings/" + id, "DELETE");
}

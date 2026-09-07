import type {
  ListingCategory,
  TransactionType,
  ListingCondition,
  SortOption,
} from "./marketplace";

// ---------------------------------------------------------------
// Shapes that travel between the backend and the screens.
// ---------------------------------------------------------------

// A signed in student, as the backend describes them.
export interface User {
  id: string;
  name: string;
  regNo: string;
  email: string;
  department: string;
  isVerified: boolean;
}

// The fuller record shown on the profile page.
export interface Profile extends User {
  year: string;
  phone: string;
  hostel: string;
  about: string;
  joinedAt: string;
}

// What the profile form can change. The register number and the
// e-mail are missing on purpose: the college verified those.
export interface ProfileEdit {
  name: string;
  department: string;
  year: string;
  phone: string;
  hostel: string;
  about: string;
}

// The owner of a listing, as attached by the backend.
export interface ListingOwner {
  _id: string;
  name: string;
  regNo: string;
  email: string;
  department: string;
  year: string;
  hostel: string;
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  category: ListingCategory;
  transactionType: TransactionType;
  condition: ListingCondition;
  price: number;
  rentUnit: string;
  image: string;
  owner: ListingOwner;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// What the create and edit form sends.
export interface ListingDraft {
  title: string;
  description: string;
  category: ListingCategory;
  transactionType: TransactionType;
  condition: ListingCondition;
  price: number;
  rentUnit: string;
  image: string;
}

// Everything the browse page can ask for at once.
export interface BrowseFilters {
  search: string;
  category: ListingCategory | "";
  type: TransactionType | "";
  sort: SortOption;
}

// ---------------------------------------------------------------
// Replies
// ---------------------------------------------------------------

export interface AuthResponse {
  message: string;
  user?: User;
  email?: string;
  needsVerification?: boolean;
  alreadyVerified?: boolean;
}

export interface ListingsResponse {
  listings: Listing[];
  count: number;
}

export interface ListingResponse {
  message?: string;
  listing: Listing;
}

export interface ProfileResponse {
  message?: string;
  profile: Profile;
  listingCount?: number;
}

export interface MessageResponse {
  message: string;
}

// ---------------------------------------------------------------
// Forms and router state
// ---------------------------------------------------------------

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

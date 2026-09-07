export enum ListingCategory {
  Furniture = "furniture",
  Books = "books",
  Electronics = "electronics",
  LabAndSafety = "lab",
}

export enum TransactionType {
  Sell = "sell",
  Rent = "rent",
  Borrow = "borrow",
  Donate = "donate",
}

export enum ListingCondition {
  New = "new",
  LikeNew = "like-new",
  Used = "used",
  Worn = "worn",
}

export const CATEGORY_VALUES: string[] = Object.values(ListingCategory);
export const TRANSACTION_VALUES: string[] = Object.values(TransactionType);
export const CONDITION_VALUES: string[] = Object.values(ListingCondition);

export enum SortOption {
  Newest = "newest",
  Oldest = "oldest",
  PriceLow = "price-low",
  PriceHigh = "price-high",
  Title = "title",
}

export const SORT_VALUES: string[] = Object.values(SortOption);

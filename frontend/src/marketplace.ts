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

export enum SortOption {
  Newest = "newest",
  Oldest = "oldest",
  PriceLow = "price-low",
  PriceHigh = "price-high",
  Title = "title",
}

export interface Option<T extends string> {
  value: T;
  label: string;
}

export const TRANSACTION_OPTIONS: Option<TransactionType>[] = [
  { value: TransactionType.Sell, label: "Buy" },
  { value: TransactionType.Rent, label: "Rent" },
  { value: TransactionType.Borrow, label: "Borrow" },
  { value: TransactionType.Donate, label: "Free" },
];

export const CATEGORY_OPTIONS: Option<ListingCategory>[] = [
  { value: ListingCategory.Furniture, label: "Furniture" },
  { value: ListingCategory.Books, label: "Books" },
  { value: ListingCategory.Electronics, label: "Electronics" },
  { value: ListingCategory.LabAndSafety, label: "Lab and safety" },
];

export const CONDITION_OPTIONS: Option<ListingCondition>[] = [
  { value: ListingCondition.New, label: "Brand new" },
  { value: ListingCondition.LikeNew, label: "Almost new" },
  { value: ListingCondition.Used, label: "Used" },
  { value: ListingCondition.Worn, label: "Well worn" },
];

export const SORT_OPTIONS: Option<SortOption>[] = [
  { value: SortOption.Newest, label: "Newest first" },
  { value: SortOption.Oldest, label: "Oldest first" },
  { value: SortOption.PriceLow, label: "Price, low to high" },
  { value: SortOption.PriceHigh, label: "Price, high to low" },
  { value: SortOption.Title, label: "Title, A to Z" },
];

export const TRANSACTION_BADGE: Record<TransactionType, string> = {
  [TransactionType.Sell]: "For sale",
  [TransactionType.Rent]: "For rent",
  [TransactionType.Borrow]: "To borrow",
  [TransactionType.Donate]: "Free to take",
};

export const CATEGORY_LABEL: Record<ListingCategory, string> = {
  [ListingCategory.Furniture]: "Furniture",
  [ListingCategory.Books]: "Books",
  [ListingCategory.Electronics]: "Electronics",
  [ListingCategory.LabAndSafety]: "Lab and safety",
};

export const CONDITION_LABEL: Record<ListingCondition, string> = {
  [ListingCondition.New]: "Brand new",
  [ListingCondition.LikeNew]: "Almost new",
  [ListingCondition.Used]: "Used",
  [ListingCondition.Worn]: "Well worn",
};

export function isFreeType(type: TransactionType): boolean {
  return type === TransactionType.Donate || type === TransactionType.Borrow;
}

export function priceText(type: TransactionType, price: number, rentUnit: string): string {
  if (type === TransactionType.Donate) return "Free";
  if (type === TransactionType.Borrow) return "Lend and return";
  if (type === TransactionType.Rent) return "\u20B9" + price + " " + (rentUnit || "per week");
  return "\u20B9" + price;
}

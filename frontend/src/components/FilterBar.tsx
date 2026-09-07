import type { ChangeEvent } from "react";

import {
  CATEGORY_OPTIONS,
  TRANSACTION_OPTIONS,
  SORT_OPTIONS,
  ListingCategory,
  TransactionType,
  SortOption,
} from "../marketplace";
import type { BrowseFilters } from "../types";

interface FilterBarProps {
  filters: BrowseFilters;
  onChange: (filters: BrowseFilters) => void;
  resultCount: number;
}

export default function FilterBar({ filters, onChange, resultCount }: FilterBarProps) {
  function chooseType(value: TransactionType): void {
    onChange({ ...filters, type: filters.type === value ? "" : value });
  }

  function chooseCategory(value: ListingCategory): void {
    onChange({ ...filters, category: filters.category === value ? "" : value });
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>): void {
    onChange({ ...filters, search: event.target.value });
  }

  function handleSort(event: ChangeEvent<HTMLSelectElement>): void {
    onChange({ ...filters, sort: event.target.value as SortOption });
  }

  const filtering: boolean =
    filters.search.trim() !== "" || filters.category !== "" || filters.type !== "";

  return (
    <section className="filters">
      <div className="searchbar">
        <input
          className="searchbar__input"
          type="search"
          value={filters.search}
          onChange={handleSearch}
          placeholder="Search for a calculator, a textbook, a chair"
          aria-label="Search listings"
        />
      </div>

      <div className="chiprow">
        <span className="chiprow__label">I want to</span>
        {TRANSACTION_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={"chip" + (filters.type === option.value ? " chip--on" : "")}
            onClick={() => chooseType(option.value)}
            aria-pressed={filters.type === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="chiprow">
        <span className="chiprow__label">Category</span>
        {CATEGORY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={"chip" + (filters.category === option.value ? " chip--on" : "")}
            onClick={() => chooseCategory(option.value)}
            aria-pressed={filters.category === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="filters__foot">
        <p className="filters__count">
          {resultCount} {resultCount === 1 ? "item" : "items"}
          {filtering ? " match your filters" : " on the marketplace"}
        </p>

        <div className="filters__right">
          {filtering ? (
            <button
              type="button"
              className="link-button"
              onClick={() =>
                onChange({ search: "", category: "", type: "", sort: filters.sort })
              }
            >
              Clear filters
            </button>
          ) : null}

          <label className="sort">
            <span className="sort__label">Sort</span>
            <select className="sort__select" value={filters.sort} onChange={handleSort}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}

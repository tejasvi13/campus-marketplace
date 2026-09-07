import { useEffect, useState } from "react";

import FilterBar from "../components/FilterBar.tsx";
import ListingCard from "../components/ListingCard.tsx";
import Notice from "../components/Notice.tsx";
import Empty from "../components/Empty.tsx";
import { browseListings } from "../api/listings.ts";
import { SortOption } from "../marketplace.ts";
import type { BrowseFilters, Listing, User } from "../types.ts";

interface BrowsePageProps {
  user: User;
}

const startingFilters: BrowseFilters = {
  search: "",
  category: "",
  type: "",
  sort: SortOption.Newest,
};

export default function BrowsePage({ user }: BrowsePageProps) {
  const [filters, setFilters] = useState<BrowseFilters>(startingFilters);
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Runs again whenever any filter changes. The short delay stops a
  // request going out on every single keystroke in the search box.
  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      setLoading(true);

      browseListings(filters)
        .then((data) => {
          if (cancelled) return;
          setListings(data.listings);
          setError("");
        })
        .catch((failure: unknown) => {
          if (cancelled) return;
          setError(failure instanceof Error ? failure.message : "Could not load listings.");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [filters]);

  const firstName: string = user.name.split(" ")[0];

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page-title">Hello, {firstName}.</h1>
        <p className="page-sub">
          Everything below belongs to somebody on this campus. Message them directly
          once you find what you need.
        </p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} resultCount={listings.length} />

      <Notice tone="error">{error}</Notice>

      {loading && listings.length === 0 ? (
        <p className="loading">Loading the marketplace…</p>
      ) : null}

      {!loading && listings.length === 0 && !error ? (
        <Empty title="Nothing matches that yet.">
          <p>
            Try a different word, or turn off a filter. If nobody has what you need,
            post a wanted item once that module is built.
          </p>
        </Empty>
      ) : null}

      <div className="grid">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Notice from "../components/Notice.tsx";
import { getListing, deleteListing } from "../api/listings.ts";
import { imageUrl } from "../images.ts";
import { CATEGORY_LABEL, CONDITION_LABEL, TRANSACTION_BADGE, priceText } from "../marketplace.ts";
import type { Listing, User } from "../types.ts";

interface ListingDetailPageProps {
  user: User;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}

export default function ListingDetailPage({ user }: ListingDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [listing, setListing] = useState<Listing | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [confirming, setConfirming] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getListing(id)
      .then((data) => {
        setListing(data.listing);
        setError("");
      })
      .catch((failure: unknown) => {
        setError(failure instanceof Error ? failure.message : "Could not load that listing.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete(): Promise<void> {
    if (!listing) return;

    try {
      await deleteListing(listing._id);
      navigate("/profile");
    } catch (failure: unknown) {
      setError(failure instanceof Error ? failure.message : "Could not remove the listing.");
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p className="loading">Loading…</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="page">
        <Notice tone="error">{error || "That listing is gone."}</Notice>
        <p className="switch">
          <Link to="/home">Back to browsing</Link>
        </p>
      </div>
    );
  }

  const isMine: boolean = listing.owner && listing.owner._id === user.id;

  return (
    <div className="page">
      <p className="crumb">
        <Link to="/home">Browse</Link> <span aria-hidden="true">/</span>{" "}
        {CATEGORY_LABEL[listing.category]}
      </p>

      <div className="detail">
        <div className="detail__image">
          <img src={imageUrl(listing.image)} alt={listing.title} />
        </div>

        <div className="detail__info">
          <span className={"tag tag--" + listing.transactionType}>
            {TRANSACTION_BADGE[listing.transactionType]}
          </span>

          <h1 className="detail__title">{listing.title}</h1>

          <p className="detail__price">
            {priceText(listing.transactionType, listing.price, listing.rentUnit)}
          </p>

          <p className="detail__description">
            {listing.description || "The owner did not add a description."}
          </p>

          <dl className="detail-list">
            <div className="detail-list__row">
              <dt>Category</dt>
              <dd>{CATEGORY_LABEL[listing.category]}</dd>
            </div>
            <div className="detail-list__row">
              <dt>Condition</dt>
              <dd>{CONDITION_LABEL[listing.condition]}</dd>
            </div>
            <div className="detail-list__row">
              <dt>Posted</dt>
              <dd>{formatDate(listing.createdAt)}</dd>
            </div>
          </dl>

          {isMine ? (
            <div className="detail__actions">
              <Link className="button" to={"/listings/" + listing._id + "/edit"}>
                Edit listing
              </Link>

              {confirming ? (
                <div className="confirm">
                  <p className="confirm__text">Remove this listing for good?</p>
                  <div className="confirm__row">
                    <button type="button" className="button button--danger" onClick={handleDelete}>
                      Yes, remove it
                    </button>
                    <button
                      type="button"
                      className="button button--quiet"
                      onClick={() => setConfirming(false)}
                    >
                      Keep it
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="button button--quiet"
                  onClick={() => setConfirming(true)}
                >
                  Delete listing
                </button>
              )}
            </div>
          ) : (
            <div className="ownercard">
              <p className="ownercard__label">Posted by</p>
              <p className="ownercard__name">{listing.owner.name}</p>
              <p className="ownercard__meta">
                {listing.owner.department}
                {listing.owner.year ? ", " + listing.owner.year : ""}
              </p>
              {listing.owner.hostel ? (
                <p className="ownercard__meta">{listing.owner.hostel}</p>
              ) : null}
              <a className="ownercard__mail" href={"mailto:" + listing.owner.email}>
                {listing.owner.email}
              </a>
              <p className="ownercard__note">
                Chat inside the app arrives with Module 6. For now, e-mail them.
              </p>
            </div>
          )}

          <Notice tone="error">{error}</Notice>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

import { imageUrl } from "../images";
import { CATEGORY_LABEL, TRANSACTION_BADGE, priceText } from "../marketplace";
import type { Listing } from "../types";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link to={"/listings/" + listing._id} className="card">
      <div className="card__image">
        <img src={imageUrl(listing.image)} alt={listing.title} loading="lazy" />
        <span className={"tag tag--" + listing.transactionType}>
          {TRANSACTION_BADGE[listing.transactionType]}
        </span>
      </div>

      <div className="card__body">
        <p className="card__category">{CATEGORY_LABEL[listing.category]}</p>
        <h3 className="card__title">{listing.title}</h3>
        <p className="card__price">
          {priceText(listing.transactionType, listing.price, listing.rentUnit)}
        </p>
        <p className="card__owner">{listing.owner ? listing.owner.name : "Unknown student"}</p>
      </div>
    </Link>
  );
}

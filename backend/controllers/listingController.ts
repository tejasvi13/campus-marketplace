import { Request, Response } from "express";
import { FilterQuery, SortOrder } from "mongoose";

import Listing, { IListing } from "../models/Listing";
import {
  ListingCategory,
  TransactionType,
  ListingCondition,
  CATEGORY_VALUES,
  TRANSACTION_VALUES,
  CONDITION_VALUES,
  SortOption,
} from "../utils/marketplace";

const OWNER_FIELDS = "name regNo email department year hostel";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function buildSort(sort: string): Record<string, SortOrder> {
  switch (sort) {
    case SortOption.Oldest:
      return { createdAt: 1 };
    case SortOption.PriceLow:
      return { price: 1 };
    case SortOption.PriceHigh:
      return { price: -1 };
    case SortOption.Title:
      return { title: 1 };
    case SortOption.Newest:
    default:
      return { createdAt: -1 };
  }
}

// GET /api/listings
export async function getListings(req: Request, res: Response): Promise<Response> {
  try {
    const search: string = String(req.query.search || "").trim();
    const category: string = String(req.query.category || "").trim();
    const type: string = String(req.query.type || "").trim();
    const sort: string = String(req.query.sort || SortOption.Newest).trim();

    const filter: FilterQuery<IListing> = { isActive: true };

    if (category && CATEGORY_VALUES.includes(category)) {
      filter.category = category;
    }

    if (type && TRANSACTION_VALUES.includes(type)) {
      filter.transactionType = type;
    }

    if (search) {
      const safe: string = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: safe, $options: "i" } },
        { description: { $regex: safe, $options: "i" } },
      ];
    }

    const listings = await Listing.find(filter)
      .populate("owner", OWNER_FIELDS)
      .sort(buildSort(sort));

    return res.status(200).json({ listings, count: listings.length });
  } catch (error: unknown) {
    console.error("getListings error:", errorMessage(error));
    return res.status(500).json({ message: "Could not load the listings." });
  }
}

// GET /api/listings/mine
export async function getMyListings(req: Request, res: Response): Promise<Response> {
  try {
    const listings = await Listing.find({ owner: req.currentUser!._id })
      .populate("owner", OWNER_FIELDS)
      .sort({ createdAt: -1 });

    return res.status(200).json({ listings, count: listings.length });
  } catch (error: unknown) {
    console.error("getMyListings error:", errorMessage(error));
    return res.status(500).json({ message: "Could not load your listings." });
  }
}

// GET /api/listings/:id
export async function getListing(req: Request, res: Response): Promise<Response> {
  try {
    const listing = await Listing.findById(req.params.id).populate("owner", OWNER_FIELDS);

    if (!listing) {
      return res.status(404).json({ message: "That listing is gone." });
    }

    return res.status(200).json({ listing });
  } catch (error: unknown) {
    console.error("getListing error:", errorMessage(error));
    return res.status(404).json({ message: "That listing is gone." });
  }
}

interface ListingBody {
  title?: string;
  description?: string;
  category?: string;
  transactionType?: string;
  condition?: string;
  price?: number | string;
  rentUnit?: string;
  image?: string;
}

function validateListing(body: ListingBody): string {
  const title: string = String(body.title || "").trim();

  if (!title) {
    return "Give the item a title.";
  }

  if (!CATEGORY_VALUES.includes(String(body.category))) {
    return "Pick a category.";
  }

  if (!TRANSACTION_VALUES.includes(String(body.transactionType))) {
    return "Pick what people can do with this item.";
  }

  if (body.condition && !CONDITION_VALUES.includes(String(body.condition))) {
    return "Pick a condition.";
  }

  const price: number = Number(body.price || 0);
  if (Number.isNaN(price) || price < 0) {
    return "The price cannot be negative.";
  }

  const type = String(body.transactionType);
  if (type === TransactionType.Sell && price <= 0) {
    return "An item for sale needs a price.";
  }

  if (type === TransactionType.Rent && price <= 0) {
    return "An item for rent needs a rate.";
  }

  return "";
}

// POST /api/listings
export async function createListing(req: Request, res: Response): Promise<Response> {
  try {
    const body: ListingBody = req.body;

    const problem: string = validateListing(body);
    if (problem) {
      return res.status(400).json({ message: problem });
    }

    const type = String(body.transactionType) as TransactionType;
    const givenAway: boolean = type === TransactionType.Donate || type === TransactionType.Borrow;

    const listing: IListing = await Listing.create({
      title: String(body.title).trim(),
      description: String(body.description || "").trim(),
      category: String(body.category) as ListingCategory,
      transactionType: type,
      condition: (body.condition || ListingCondition.Used) as ListingCondition,
      // Donations and lends are always free, whatever was typed in the box.
      price: givenAway ? 0 : Number(body.price || 0),
      rentUnit: type === TransactionType.Rent ? String(body.rentUnit || "per week").trim() : "",
      image: String(body.image || "placeholder.svg").trim(),
      owner: req.currentUser!._id,
      isActive: true,
    });

    const saved = await listing.populate("owner", OWNER_FIELDS);

    return res.status(201).json({ message: "Listing posted.", listing: saved });
  } catch (error: unknown) {
    console.error("createListing error:", errorMessage(error));
    return res.status(500).json({ message: "Could not post the listing." });
  }
}

// PUT /api/listings/:id
export async function updateListing(req: Request, res: Response): Promise<Response> {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "That listing is gone." });
    }

    // You may only touch your own items.
    if (String(listing.owner) !== String(req.currentUser!._id)) {
      return res.status(403).json({ message: "That listing belongs to somebody else." });
    }

    const body: ListingBody = req.body;

    const problem: string = validateListing(body);
    if (problem) {
      return res.status(400).json({ message: problem });
    }

    const type = String(body.transactionType) as TransactionType;
    const givenAway: boolean = type === TransactionType.Donate || type === TransactionType.Borrow;

    listing.title = String(body.title).trim();
    listing.description = String(body.description || "").trim();
    listing.category = String(body.category) as ListingCategory;
    listing.transactionType = type;
    listing.condition = (body.condition || ListingCondition.Used) as ListingCondition;
    listing.price = givenAway ? 0 : Number(body.price || 0);
    listing.rentUnit = type === TransactionType.Rent ? String(body.rentUnit || "per week").trim() : "";
    listing.image = String(body.image || listing.image).trim();

    await listing.save();
    const saved = await listing.populate("owner", OWNER_FIELDS);

    return res.status(200).json({ message: "Listing updated.", listing: saved });
  } catch (error: unknown) {
    console.error("updateListing error:", errorMessage(error));
    return res.status(500).json({ message: "Could not update the listing." });
  }
}

// DELETE /api/listings/:id
export async function deleteListing(req: Request, res: Response): Promise<Response> {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "That listing is gone." });
    }

    if (String(listing.owner) !== String(req.currentUser!._id)) {
      return res.status(403).json({ message: "That listing belongs to somebody else." });
    }

    await listing.deleteOne();

    return res.status(200).json({ message: "Listing removed." });
  } catch (error: unknown) {
    console.error("deleteListing error:", errorMessage(error));
    return res.status(500).json({ message: "Could not remove the listing." });
  }
}

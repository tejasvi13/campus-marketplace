
import mongoose, { Document, Schema, Model, Types } from "mongoose";

import {
  ListingCategory,
  TransactionType,
  ListingCondition,
  CATEGORY_VALUES,
  TRANSACTION_VALUES,
  CONDITION_VALUES,
} from "../utils/marketplace";

export interface IListing extends Document {
  title: string;
  description: string;
  category: ListingCategory;
  transactionType: TransactionType;
  condition: ListingCondition;
  price: number;
  rentUnit: string;
  image: string;
  owner: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<IListing>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORY_VALUES,
    },
    transactionType: {
      type: String,
      required: true,
      enum: TRANSACTION_VALUES,
    },
    condition: {
      type: String,
      default: ListingCondition.Used,
      enum: CONDITION_VALUES,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    rentUnit: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "placeholder.svg",
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

listingSchema.index({ title: "text", description: "text" });

const Listing: Model<IListing> = mongoose.model<IListing>("Listing", listingSchema);

export default Listing;

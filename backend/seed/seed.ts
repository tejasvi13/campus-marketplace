import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import connectDB from "../config/db";
import User, { IUser } from "../models/User";
import Listing from "../models/Listing";
import { ListingCategory, TransactionType, ListingCondition } from "../utils/marketplace";

interface SeedStudent {
  name: string;
  regNo: string;
  email: string;
  department: string;
  year: string;
  hostel: string;
  phone: string;
  about: string;
  password: string;
  isVerified: boolean;
}

interface SeedListing {
  ownerEmail: string;
  title: string;
  description: string;
  category: ListingCategory;
  transactionType: TransactionType;
  condition: ListingCondition;
  price: number;
  rentUnit: string;
  image: string;
}

const STUDENTS: SeedStudent[] = [
  {
    name: "J Tejasvi",
    regNo: "2026611028",
    email: "jtejasvi@student.edu",
    department: "Computer Science",
    year: "Second year",
    hostel: "Block C, room 214",
    phone: "",
    about: "Clearing out things from first year. Message me before eight in the evening.",
    password: "tejasvi123",
    isVerified: true,
  },
  {
    name: "Meenakshi R",
    regNo: "2026611044",
    email: "meenakshi@student.edu",
    department: "Mechanical Engineering",
    year: "Third year",
    hostel: "Block A, room 108",
    phone: "",
    about: "Workshop and drawing equipment mostly.",
    password: "meena123",
    isVerified: true,
  },
  {
    name: "Arun Prasad",
    regNo: "2025611007",
    email: "arunp@student.edu",
    department: "Electronics",
    year: "Final year",
    hostel: "Block D, room 302",
    phone: "",
    about: "Final year, so most of this has to go before June.",
    password: "arun1234",
    isVerified: true,
  },
  {
    name: "Divya Sekar",
    regNo: "2027611091",
    email: "divyas@student.edu",
    department: "Biotechnology",
    year: "First year",
    hostel: "Block B, room 011",
    phone: "",
    about: "Looking for lab things I can borrow rather than buy.",
    password: "divya123",
    isVerified: true,
  },
];

// Listings

const LISTINGS: SeedListing[] = [
  {
    ownerEmail: "jtejasvi@student.edu",
    title: "Wooden study chair",
    description:
      "Plain wooden chair from the hostel furniture shop on the main road. One armrest has a scratch, nothing wobbles. Collect from Block C, I cannot carry it far.",
    category: ListingCategory.Furniture,
    transactionType: TransactionType.Sell,
    condition: ListingCondition.Used,
    price: 850,
    rentUnit: "",
    image: "chair.svg",
  },
  {
    ownerEmail: "jtejasvi@student.edu",
    title: "Engineering Mathematics, Volume II",
    description:
      "Grewal, the edition everyone uses. Pencil notes in the first four chapters, the rest is clean. Giving it away to whoever needs it for the semester.",
    category: ListingCategory.Books,
    transactionType: TransactionType.Donate,
    condition: ListingCondition.Used,
    price: 0,
    rentUnit: "",
    image: "book.svg",
  },
  {
    ownerEmail: "jtejasvi@student.edu",
    title: "Casio fx-991EX scientific calculator",
    description:
      "Works perfectly, cover included. Renting it out between exam seasons. Return it before the end of the semester please.",
    category: ListingCategory.Electronics,
    transactionType: TransactionType.Rent,
    condition: ListingCondition.LikeNew,
    price: 60,
    rentUnit: "per week",
    image: "calculator.svg",
  },
  {
    ownerEmail: "jtejasvi@student.edu",
    title: "Lab coat, size M",
    description:
      "White cotton coat, washed and pressed. Happy to lend it for a lab session or two if you forgot yours. Just return it clean.",
    category: ListingCategory.LabAndSafety,
    transactionType: TransactionType.Borrow,
    condition: ListingCondition.Used,
    price: 0,
    rentUnit: "",
    image: "lab-coat.svg",
  },
  {
    ownerEmail: "meenakshi@student.edu",
    title: "Drafting board with mini-drafter",
    description:
      "Full size board, the mini-drafter clamps on properly. Used it for two semesters of engineering drawing. Selling because the course is over.",
    category: ListingCategory.Furniture,
    transactionType: TransactionType.Sell,
    condition: ListingCondition.Used,
    price: 1200,
    rentUnit: "",
    image: "drafting-board.svg",
  },
  {
    ownerEmail: "meenakshi@student.edu",
    title: "Safety goggles, unopened",
    description:
      "Bought two pairs by mistake. This one has never left the packet. Free to any first year who needs them for the workshop.",
    category: ListingCategory.LabAndSafety,
    transactionType: TransactionType.Donate,
    condition: ListingCondition.New,
    price: 0,
    rentUnit: "",
    image: "goggles.svg",
  },
  {
    ownerEmail: "meenakshi@student.edu",
    title: "Folding study table",
    description:
      "Fits beside a hostel bed and folds flat when you are done. Renting it out for the semester rather than storing it at home.",
    category: ListingCategory.Furniture,
    transactionType: TransactionType.Rent,
    condition: ListingCondition.Used,
    price: 150,
    rentUnit: "per month",
    image: "desk.svg",
  },
  {
    ownerEmail: "arunp@student.edu",
    title: "Clip-on study lamp",
    description:
      "Warm light, clamps onto a bed frame or a shelf. The switch needs a firm press. Selling cheap because I am leaving in June.",
    category: ListingCategory.Electronics,
    transactionType: TransactionType.Sell,
    condition: ListingCondition.Worn,
    price: 220,
    rentUnit: "",
    image: "lamp.svg",
  },
  {
    ownerEmail: "arunp@student.edu",
    title: "Soldering iron kit",
    description:
      "Iron, stand, a roll of solder and a desoldering pump. Lending it out for project work, a week at a time. Do not take it out of the department.",
    category: ListingCategory.Electronics,
    transactionType: TransactionType.Borrow,
    condition: ListingCondition.Used,
    price: 0,
    rentUnit: "",
    image: "soldering-iron.svg",
  },
  {
    ownerEmail: "arunp@student.edu",
    title: "Wired headphones",
    description:
      "Over-ear, 3.5mm jack, no battery to worry about. The ear cushion on the left side is starting to peel.",
    category: ListingCategory.Electronics,
    transactionType: TransactionType.Sell,
    condition: ListingCondition.Used,
    price: 400,
    rentUnit: "",
    image: "headphones.svg",
  },
  {
    ownerEmail: "divyas@student.edu",
    title: "Data Structures notes, full semester",
    description:
      "Handwritten, indexed by unit, covers everything that came in the exam last year. Lending the set out for a week at a time.",
    category: ListingCategory.Books,
    transactionType: TransactionType.Borrow,
    condition: ListingCondition.Used,
    price: 0,
    rentUnit: "",
    image: "notes.svg",
  },
  {
    ownerEmail: "divyas@student.edu",
    title: "Biotechnology lab manual",
    description:
      "First year manual with the practical records still blank at the back. Selling it for less than half of what the bookshop charges.",
    category: ListingCategory.Books,
    transactionType: TransactionType.Sell,
    condition: ListingCondition.LikeNew,
    price: 180,
    rentUnit: "",
    image: "manual.svg",
  },
];

async function run(): Promise<void> {
  await connectDB();

  await Listing.deleteMany({});
  console.log("Cleared existing listings.");

  const idByEmail = new Map<string, mongoose.Types.ObjectId>();

  for (const student of STUDENTS) {
    const existing: IUser | null = await User.findOne({ email: student.email });

    if (existing) {
      Object.assign(existing, student);
      existing.otpCode = null;
      existing.otpExpiresAt = null;
      await existing.save();
      idByEmail.set(student.email, existing._id as mongoose.Types.ObjectId);
      console.log("Updated student ->", student.email);
    } else {
      const created: IUser = await User.create({ ...student, otpCode: null, otpExpiresAt: null });
      idByEmail.set(student.email, created._id as mongoose.Types.ObjectId);
      console.log("Created student ->", student.email);
    }
  }

  for (const item of LISTINGS) {
    const ownerId = idByEmail.get(item.ownerEmail);

    if (!ownerId) {
      console.log("Skipped listing, no owner:", item.title);
      continue;
    }

    await Listing.create({
      title: item.title,
      description: item.description,
      category: item.category,
      transactionType: item.transactionType,
      condition: item.condition,
      price: item.price,
      rentUnit: item.rentUnit,
      image: item.image,
      owner: ownerId,
      isActive: true,
    });
  }

  console.log("");
  console.log("Seeded " + STUDENTS.length + " students and " + LISTINGS.length + " listings.");
  console.log("Sign in as jtejasvi@student.edu with the password tejasvi123");
  console.log("");

  await mongoose.connection.close();
  process.exit(0);
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Seeding failed:", message);
  process.exit(1);
});

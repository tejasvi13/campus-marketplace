import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import connectDB from "../config/db";
import User from "../models/User";

interface SeedStudent {
  name: string;
  regNo: string;
  email: string;
  department: string;
  password: string;
  isVerified: boolean;
  otpCode: string | null;
  otpExpiresAt: Date | null;
}

const EXISTING_STUDENT: SeedStudent = {
  name: "J Tejasvi",
  regNo: "2026611028",
  email: "jtejasvi@student.edu",
  department: "Computer Science",
  password: "tejasvi123",
  isVerified: true,
  otpCode: null,
  otpExpiresAt: null,
};

async function run(): Promise<void> {
  await connectDB();

  const existing = await User.findOne({ email: EXISTING_STUDENT.email });

  if (existing) {
    await User.updateOne({ email: EXISTING_STUDENT.email }, EXISTING_STUDENT);
    console.log("Updated existing user ->", EXISTING_STUDENT.email);
  } else {
    await User.create(EXISTING_STUDENT);
    console.log("Created user ->", EXISTING_STUDENT.email);
  }

  console.log("Password:", EXISTING_STUDENT.password);

  await mongoose.connection.close();
  process.exit(0);
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Seeding failed:", message);
  process.exit(1);
});

require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const EXISTING_STUDENT = {
  name: "J Tejasvi",
  regNo: "2026611028",
  email: "jtejasvi@student.edu",
  department: "Computer Science",
  password: "tejasvi123",
  isVerified: true,
  otpCode: null,
  otpExpiresAt: null,
};

async function run() {
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

run().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});

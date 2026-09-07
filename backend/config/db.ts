import mongoose from "mongoose";

async function connectDB(): Promise<void> {
  const uri: string = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus_marketplace";

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected ->", uri);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("MongoDB connection failed:", message);
    process.exit(1);
  }
}

export default connectDB;

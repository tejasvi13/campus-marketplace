import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from "cors";

import connectDB from "./config/db";
import { authRouter } from "./routes/authRoutes";

const app: Application = express();
const PORT: number = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

// A quick way to check the server is alive from the browser.
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", stage: 2, module: "User Authentication" });
});

app.use("/api/auth", authRouter);

// Anything else is a wrong URL.
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found: " + req.originalUrl });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("");
    console.log("Campus Marketplace API running on http://localhost:" + PORT);
    console.log("OTP codes will be printed here.");
    console.log("");
  });
});
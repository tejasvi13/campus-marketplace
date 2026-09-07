import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from "cors";

import connectDB from "./config/db";
import { authRouter } from "./routes/authRoutes";
import { listingRouter } from "./routes/listingRoutes";
import { userRouter } from "./routes/userRoutes";

const app: Application = express();
const PORT: number = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", stage: 3, modules: "1, 2, 3, 4" });
});

app.use("/api/auth", authRouter);
app.use("/api/listings", listingRouter);
app.use("/api/users", userRouter);

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

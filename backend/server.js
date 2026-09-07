require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", stage: 1, module: "User Authentication" });
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
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

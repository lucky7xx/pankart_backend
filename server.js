const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Route files
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Basic route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Optional: Add a health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/orders", orderRoutes);

// If you want to connect to MongoDB (optional for initial testing)
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

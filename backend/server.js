const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(bodyParser.json());
app.use(express.json());

console.log("🧩 Registering all routes...");

// Register routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// DEBUG: log right before registering cart
console.log("📦 Registering /api/cart route...");
const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);

app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/uploads", express.static("uploads"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

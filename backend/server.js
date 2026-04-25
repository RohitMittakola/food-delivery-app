const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import all models BEFORE syncing
const User = require("./models/User");
const FoodItem = require("./models/FoodItem");
const Cart = require("./models/Cart");
const CartItem = require("./models/CartItem");
const Order = require("./models/Order");

// Define associations BEFORE syncing
Cart.hasMany(CartItem, { as: "items", foreignKey: "cartId" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });
CartItem.belongsTo(FoodItem, { as: "foodItem", foreignKey: "foodItemId" });
FoodItem.hasMany(CartItem, { foreignKey: "foodItemId" });

// Database connection and sync
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
    // Use force: false to preserve data (don't drop/recreate tables)
    return sequelize.sync({ force: false, alter: false });
  })
  .then(() => {
    console.log("Models synced with database");

    // Routes (load after DB is ready)
    const authRoutes = require("./routes/auth");
    const foodRoutes = require("./routes/food");
    const recommendRoutes = require("./routes/recommendation");
    const cartRoutes = require("./routes/cart");
    const ordersRoutes = require("./routes/orders");

    app.use("/api/auth", authRoutes);
    app.use("/api/admin", require("./routes/admin"));
    app.use("/api/food", foodRoutes);
    app.use("/api/recommendations", recommendRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/orders", ordersRoutes);

    // Basic test route
    app.get("/", (req, res) => {
      res.send("Food Delivery API is running");
    });

    // Global error handler middleware (MUST be last)
    app.use((err, req, res, next) => {
      console.error("Global error handler:", err);
      res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    });

    // Start server AFTER database is ready
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit - just log it
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  console.error("Stack trace:", error.stack);
  // Don't exit - just log it so server keeps running
});

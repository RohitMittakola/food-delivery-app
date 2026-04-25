/**
 * Database initialization script
 * Run this ONCE to create/update the schema properly
 * Usage: node scripts/initDatabase.js
 */
const sequelize = require("../config/database");

// Import all models
const User = require("../models/User");
const FoodItem = require("../models/FoodItem");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");

// Define associations
Cart.hasMany(CartItem, { as: "items", foreignKey: "cartId" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });
CartItem.belongsTo(FoodItem, { as: "foodItem", foreignKey: "foodItemId" });
FoodItem.hasMany(CartItem, { foreignKey: "foodItemId" });

async function initDatabase() {
  try {
    console.log("🔄 Authenticating database...");
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    console.log(
      "🔄 Syncing models (first time creates tables, subsequent runs preserve data)...",
    );
    // Use { force: false, alter: false } to preserve existing data
    await sequelize.sync({ force: false, alter: false });
    console.log("✅ Models synced successfully");

    console.log("\n📋 Database Schema Summary:");
    console.log("  - Users table (users)");
    console.log("  - Food Items table (fooditems)");
    console.log("  - Carts table (carts)");
    console.log("  - Cart Items table (cartitems)");

    console.log(
      "\n✨ Database initialization complete! Your data will now persist across server restarts.",
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

initDatabase();

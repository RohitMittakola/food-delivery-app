const mongoose = require("mongoose");
const sequelize = require("../config/database");
const User = require("../models/User");
const FoodItem = require("../models/FoodItem");
require("dotenv").config();

// Old Mongoose models (for reading from MongoDB)
const UserSchemaOld = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    goal: String,
    bmi: Number,
  },
  { timestamps: true },
);

const FoodItemSchemaOld = new mongoose.Schema(
  {
    name: String,
    price: Number,
    category: String,
    calories: Number,
    protein: Number,
    sugarFree: Boolean,
  },
  { timestamps: true },
);

const UserOld = mongoose.model("User", UserSchemaOld);
const FoodItemOld = mongoose.model("FoodItem", FoodItemSchemaOld);

async function migrateData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Connect to MySQL
    await sequelize.authenticate();
    console.log("Connected to MySQL");

    // Sync tables
    await sequelize.sync({ alter: true });
    console.log("MySQL tables synced");

    // Migrate Users
    const users = await UserOld.find();
    console.log(`Found ${users.length} users in MongoDB`);

    for (const user of users) {
      await User.create({
        name: user.name,
        email: user.email,
        password: user.password,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        bmi: user.bmi,
      });
    }
    console.log(`Migrated ${users.length} users to MySQL`);

    // Migrate Food Items
    const foodItems = await FoodItemOld.find();
    console.log(`Found ${foodItems.length} food items in MongoDB`);

    for (const item of foodItems) {
      await FoodItem.create({
        name: item.name,
        price: item.price,
        category: item.category,
        calories: item.calories,
        protein: item.protein,
        sugarFree: item.sugarFree,
      });
    }
    console.log(`Migrated ${foodItems.length} food items to MySQL`);

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    await sequelize.close();
  }
}

migrateData();

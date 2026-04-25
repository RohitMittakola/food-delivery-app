const express = require("express");
const FoodItemService = require("../services/FoodItemService");

const router = express.Router();

// Get all food items
router.get("/", async (req, res) => {
  try {
    const foodItems = await FoodItemService.findAll();
    res.json(foodItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching food items", error: error.message });
  }
});

// Add food item
router.post("/", async (req, res) => {
  try {
    const { name, price, category, calories, protein, sugarFree } = req.body;

    const foodItem = await FoodItemService.create({
      name,
      price,
      category,
      calories,
      protein,
      sugarFree,
    });

    res.status(201).json({ message: "Food item added successfully", foodItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding food item", error: error.message });
  }
});

module.exports = router;

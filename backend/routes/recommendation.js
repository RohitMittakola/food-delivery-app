const express = require("express");
const { Op } = require("sequelize"); // Import Sequelize Operators for complex queries
const UserService = require("../services/UserService");

// Import the FoodItem model directly so we can run advanced sorting logic
// (Note: If your app uses a central models folder setup, you may need to change 
// this line to: const { FoodItem } = require("../models"); )
const FoodItem = require("../models/FoodItem");

const router = express.Router();

// Helper function to calculate BMI
const calculateBMI = (weightKg, heightM) => {
  return (weightKg / (heightM * heightM)).toFixed(1);
};

// Get recommendations for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user
    const user = await UserService.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has filled out health data
    if (!user.height || !user.weight || !user.goal) {
      return res.status(400).json({
        message:
          "Please update your health profile (height in meters, weight in kg, and goal) to get recommendations.",
      });
    }

    // Calculate BMI and determine category
    const bmi = calculateBMI(user.weight, user.height);
    let healthMessage = "";

    if (bmi < 18.5) healthMessage = "Underweight";
    else if (bmi >= 18.5 && bmi <= 24.9) healthMessage = "Normal weight";
    else if (bmi >= 25 && bmi <= 29.9) healthMessage = "Overweight";
    else healthMessage = "Obese";

    // --- NEW SMART AI FILTERING LOGIC ---
    let foodOptions = {};
    let orderLogic = [];

    switch (user.goal) {
      case "Muscle Gain":
        // High protein foods, sort by most protein
        foodOptions = { category: "Protein" };
        orderLogic = [["protein", "DESC"]];
        break;

      case "Weight Loss":
        // Foods under 350 calories, sort by lowest calories
        foodOptions = { calories: { [Op.lte]: 350 } };
        orderLogic = [["calories", "ASC"]];
        break;

      case "Diabetic-Friendly":
        // Strictly sugar-free, sorted by high protein
        foodOptions = { sugarFree: true };
        orderLogic = [["protein", "DESC"]];
        break;

      default:
        foodOptions = {};
        orderLogic = [["createdAt", "DESC"]];
    }

    // Fetch the perfectly matched foods from the database
    const recommendations = await FoodItem.findAll({
      where: foodOptions,
      order: orderLogic,
      limit: 4, // Only show the top 4 best matches
    });

    res.json({
      user: user.name,
      bmi: bmi,
      status: healthMessage,
      goal: user.goal,
      recommendedFoods: recommendations,
    });
  } catch (error) {
    console.error("Recommendation Error:", error);
    res.status(500).json({
      message: "Error fetching recommendations",
      error: error.message,
    });
  }
});

module.exports = router;
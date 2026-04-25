const sequelize = require('../config/database');
const FoodItem = require('../models/FoodItem');
require('dotenv').config();

const foodItems = [
  { name: 'Grilled Chicken Breast', price: 320, category: 'Protein', calories: 250, protein: 35, sugarFree: 1 },
  { name: 'Fresh Greek Salad', price: 220, category: 'Salad', calories: 150, protein: 12, sugarFree: 1 },
  { name: 'Salmon Fillet', price: 450, category: 'Protein', calories: 280, protein: 40, sugarFree: 1 },
  { name: 'Veggie Power Bowl', price: 280, category: 'Vegetarian', calories: 200, protein: 15, sugarFree: 1 },
  { name: 'Egg White Omelette', price: 180, category: 'Breakfast', calories: 180, protein: 25, sugarFree: 1 },
  { name: 'Brown Rice & Veggies', price: 250, category: 'Carbs', calories: 300, protein: 10, sugarFree: 1 },
  { name: 'Tuna Salad', price: 260, category: 'Protein', calories: 200, protein: 32, sugarFree: 1 },
  { name: 'Quinoa Bowl', price: 300, category: 'Vegetarian', calories: 280, protein: 18, sugarFree: 1 },
  { name: 'Grilled Fish Tacos', price: 320, category: 'Seafood', calories: 270, protein: 38, sugarFree: 1 },
  { name: 'Steamed Broccoli & Chicken', price: 290, category: 'Protein', calories: 220, protein: 30, sugarFree: 1 },
  { name: 'Spinach & Mushroom Omelet', price: 200, category: 'Breakfast', calories: 190, protein: 22, sugarFree: 1 },
  { name: 'Lentil Soup', price: 150, category: 'Vegetarian', calories: 170, protein: 14, sugarFree: 1 },
  { name: 'Turkey Meatballs', price: 350, category: 'Protein', calories: 240, protein: 36, sugarFree: 1 },
  { name: 'Roasted Almonds & Berries', price: 180, category: 'Snack', calories: 200, protein: 8, sugarFree: 1 },
  { name: 'Grilled Tofu Steak', price: 270, category: 'Vegetarian', calories: 210, protein: 28, sugarFree: 1 },
  { name: 'Shrimp Skewers', price: 380, category: 'Seafood', calories: 160, protein: 32, sugarFree: 1 },
  { name: 'Cauliflower Rice Bowl', price: 240, category: 'Vegetarian', calories: 120, protein: 12, sugarFree: 1 },
  { name: 'Chicken Breast Salad', price: 310, category: 'Protein', calories: 260, protein: 38, sugarFree: 1 },
  { name: 'Baked Sweet Potato', price: 120, category: 'Carbs', calories: 180, protein: 4, sugarFree: 1 },
  { name: 'Protein Smoothie Bowl', price: 200, category: 'Breakfast', calories: 280, protein: 25, sugarFree: 1 },
];

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    await sequelize.sync({ alter: true });
    console.log('✅ Models synced');

    // Clear existing food items (optional)
    await FoodItem.destroy({ where: {} });
    console.log('✅ Cleared existing food items');

    // Insert new food items
    const created = await FoodItem.bulkCreate(foodItems);
    console.log(`✅ Successfully added ${created.length} food items!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

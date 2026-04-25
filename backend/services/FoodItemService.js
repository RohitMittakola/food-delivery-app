const { Op } = require("sequelize");
const FoodItem = require("../models/FoodItem");

class FoodItemService {
  async findAll() {
    return await FoodItem.findAll();
  }

  async create(foodData) {
    return await FoodItem.create(foodData);
  }

  async findByGoal(goal) {
    let filters = {};

    if (goal === "Weight Loss") {
      filters = {
        calories: { [Op.lte]: 300 },
        protein: { [Op.gte]: 20 },
        sugarFree: 1, // MySQL stores boolean as 0 or 1
      };
    } else if (goal === "Muscle Gain") {
      filters = {
        protein: { [Op.gte]: 30 },
        calories: { [Op.gt]: 300 },
      };
    } else if (goal === "Diabetic-Friendly") {
      filters = {
        sugarFree: 1, // MySQL stores boolean as 0 or 1
        calories: { [Op.lte]: 350 },
      };
    }

    return await FoodItem.findAll({ where: filters });
  }

  async findById(foodId) {
    return await FoodItem.findByPk(foodId);
  }
}

module.exports = new FoodItemService();

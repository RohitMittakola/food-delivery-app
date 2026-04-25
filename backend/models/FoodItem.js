const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FoodItem = sequelize.define(
  "FoodItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    protein: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sugarFree: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "fooditems",
  },
);

module.exports = FoodItem;

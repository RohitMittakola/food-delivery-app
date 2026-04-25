const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CartItem = sequelize.define(
  "CartItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "carts",
        key: "id",
      },
    },
    foodItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "fooditems",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "cartitems",
  },
);

module.exports = CartItem;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "No Address Provided" // Just in case old orders don't have one
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Denied', 'Delivered'),
      defaultValue: 'Pending'
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Delivered", "Cancelled"),
      defaultValue: "Pending",
      allowNull: false,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    timestamps: true,
    tableName: "orders",
  },
);

module.exports = Order;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true, // in meters
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true, // in kg
    },
    goal: {
      type: DataTypes.ENUM("Weight Loss", "Muscle Gain", "Diabetic-Friendly"),
      allowNull: true,
    },
    bmi: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "users",
  },
);

module.exports = User;

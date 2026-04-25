const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "food_delivery",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "bharath@124",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: console.log, // Enable logging to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // Enable foreign key constraints
    dialectOptions: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
  },
);

module.exports = sequelize;

const { Op } = require("sequelize");
const User = require("../models/User");

class UserService {
  async findByEmail(email) {
    return await User.findOne({
      where: {
        email: {
          [Op.like]: email.toLowerCase().trim(),
        },
      },
    });
  }

  async findById(userId) {
    return await User.findByPk(userId);
  }

  async create(userData) {
    // Normalize email
    userData.email = userData.email.toLowerCase().trim();
    return await User.create(userData);
  }

  async updateProfile(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
    return await user.update(updateData);
  }

  async getAllUsers() {
    return await User.findAll();
  }
}

module.exports = new UserService();

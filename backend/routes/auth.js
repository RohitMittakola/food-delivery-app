const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserService = require("../services/UserService");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await UserService.findByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserService.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await UserService.findByEmail(normalizedEmail);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // CREATE THE VIP PASS (JWT TOKEN)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // Send the token AND the user info back
    res.json({
      message: "Login successful",
      token: token,
      userId: user.id,
      name: user.name
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Update user profile
router.put("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { age, gender, height, weight, goal, bmi } = req.body;

    // Validate required fields
    if (!height || !weight || !goal) {
      return res.status(400).json({
        message: "Height, weight, and goal are required",
      });
    }

    // Calculate BMI if not provided
    const calculatedBmi = bmi || (weight / (height * height)).toFixed(1);

    const updatedUser = await UserService.updateProfile(userId, {
      age: age ? parseInt(age) : null,
      gender: gender || "Male",
      height: parseFloat(height),
      weight: parseFloat(weight),
      goal,
      bmi: calculatedBmi,
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});
// Fetch User Profile
router.get("/profile/:id", async (req, res) => {
  try {
    // We use your existing UserService here!
    const user = await UserService.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user data back to the React frontend
    res.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});
module.exports = router;

const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const User = require("../models/User");
const Order = require("../models/Order");
const FoodItem = require("../models/FoodItem");

// 1. Verify Admin (Existing)
router.get("/verify", isAdmin, (req, res) => {
    res.json({ message: "Welcome Admin" });
});

// 2. Get All Users
router.get("/users", isAdmin, async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// 3. Get All Orders
router.get("/orders", isAdmin, async (req, res) => {
    try {
        const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});

// 4. Add New Food Item
router.post("/food", isAdmin, async (req, res) => {
    try {
        const newFood = await FoodItem.create(req.body);
        res.status(201).json(newFood);
    } catch (error) {
        res.status(500).json({ message: "Error adding food item" });
    }
});
// 5. Update Order Status
router.put("/orders/:id/status", isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        // Find the order and update its status
        await Order.update(
            { status: status },
            { where: { id: req.params.id } }
        );
        res.json({ message: `Order marked as ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating order status" });
    }
});
module.exports = router;
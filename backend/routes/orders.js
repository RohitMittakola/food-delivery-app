const express = require("express");
const OrderService = require("../services/OrderService");
const CartService = require("../services/CartService");

const router = express.Router();

// Create order from cart and clear it
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Creating order for userId: ${userId}`);

    // Create order from cart
    const order = await OrderService.createOrderFromCart(userId);

    // Clear the cart after order is created
    await CartService.clearCart(userId);
    console.log(`Cart cleared for userId: ${userId}`);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all orders for user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching orders for userId: ${userId}`);

    const orders = await OrderService.getUserOrders(userId);

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

// Get order by ID
router.get("/detail/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(`Fetching order: ${orderId}`);

    const order = await OrderService.getOrderById(orderId);

    res.json(order);
  } catch (error) {
    console.error("Get order detail error:", error);
    res.status(500).json({
      message: "Error fetching order",
      error: error.message,
    });
  }
});

// Update order status (admin)
router.put("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    console.log(`Updating order ${orderId} status to: ${status}`);

    const order = await OrderService.updateOrderStatus(orderId, status);

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      message: "Error updating order",
      error: error.message,
    });
  }
});

// Get user's order count
router.get("/count/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await OrderService.getUserOrderCount(userId);

    res.json({ count });
  } catch (error) {
    console.error("Get order count error:", error);
    res.status(500).json({
      message: "Error getting order count",
      error: error.message,
    });
  }
});

// Get user's total spending
router.get("/spending/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const totalSpending = await OrderService.getUserTotalSpending(userId);

    res.json({ totalSpending });
  } catch (error) {
    console.error("Get total spending error:", error);
    res.status(500).json({
      message: "Error calculating total spending",
      error: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const CartService = require("../services/CartService");

const router = express.Router();

// Add to cart
router.post("/add", async (req, res) => {
  try {
    const { userId, foodItemId, quantity = 1 } = req.body;

    if (!userId || !foodItemId) {
      return res
        .status(400)
        .json({ message: "userId and foodItemId are required" });
    }

    const result = await CartService.addToCart(userId, foodItemId, quantity);
    res.status(201).json(result);
  } catch (error) {
    console.error("Add to cart error:", error);
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
});

// Get cart
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await CartService.getCart(userId);
    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
});

// Update quantity
router.put("/item/:cartItemId", async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({ message: "Quantity is required" });
    }

    const result = await CartService.updateQuantity(
      cartItemId,
      parseInt(quantity),
    );
    res.json(result);
  } catch (error) {
    console.error("Update quantity error:", error);
    res
      .status(500)
      .json({ message: "Error updating quantity", error: error.message });
  }
});

// Remove item
router.delete("/item/:cartItemId", async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const result = await CartService.removeFromCart(cartItemId);
    res.json(result);
  } catch (error) {
    console.error("Remove item error:", error);
    res
      .status(500)
      .json({ message: "Error removing item", error: error.message });
  }
});

// Clear cart
router.delete("/clear/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Clearing cart for userId: ${userId}`);
    const result = await CartService.clearCart(userId);
    console.log(`Cart cleared successfully for userId: ${userId}`);
    res.json(result);
  } catch (error) {
    console.error("Clear cart error:", error);
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
});

// Get cart count
router.get("/count/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await CartService.getCartItemCount(userId);
    res.json({ count });
  } catch (error) {
    console.error("Get cart count error:", error);
    res
      .status(500)
      .json({ message: "Error getting cart count", error: error.message });
  }
});

module.exports = router;

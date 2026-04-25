const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const FoodItem = require("../models/FoodItem");
const { Op } = require("sequelize");

class CartService {
  // Get or create cart for user
  async getOrCreateCart(userId) {
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }
    return cart;
  }

  // Add item to cart
  async addToCart(userId, foodItemId, quantity) {
    try {
      // Get or create cart
      const cart = await this.getOrCreateCart(userId);

      // Get food item to get its price
      const foodItem = await FoodItem.findByPk(foodItemId);
      if (!foodItem) {
        throw new Error("Food item not found");
      }

      // Check if item already in cart
      let cartItem = await CartItem.findOne({
        where: { cartId: cart.id, foodItemId },
      });

      if (cartItem) {
        // Update quantity if already exists
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        // Create new cart item
        cartItem = await CartItem.create({
          cartId: cart.id,
          foodItemId,
          quantity,
          price: foodItem.price,
        });
      }

      return { success: true, cartItem, message: "Item added to cart" };
    } catch (error) {
      throw new Error(`Error adding to cart: ${error.message}`);
    }
  }

  // Get cart with all items
  async getCart(userId) {
    try {
      const cart = await Cart.findOne({
        where: { userId },
        include: [
          {
            model: CartItem,
            as: "items",
            include: [{ model: FoodItem, as: "foodItem" }],
          },
        ],
      });

      if (!cart) {
        // Return empty cart if not found
        return { id: null, userId, items: [], total: 0 };
      }

      // Calculate total
      const total = cart.items.reduce((sum, item) => {
        return sum + parseFloat(item.price) * item.quantity;
      }, 0);

      return { ...cart.toJSON(), total };
    } catch (error) {
      console.error("getCart error:", error);
      throw new Error(`Error getting cart: ${error.message}`);
    }
  }

  // Update quantity
  async updateQuantity(cartItemId, newQuantity) {
    try {
      if (newQuantity <= 0) {
        return await this.removeFromCart(cartItemId);
      }

      const cartItem = await CartItem.findByPk(cartItemId);
      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      cartItem.quantity = newQuantity;
      await cartItem.save();
      return cartItem;
    } catch (error) {
      throw new Error(`Error updating quantity: ${error.message}`);
    }
  }

  // Remove item from cart
  async removeFromCart(cartItemId) {
    try {
      const cartItem = await CartItem.findByPk(cartItemId);
      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      await cartItem.destroy();
      return { success: true, message: "Item removed from cart" };
    } catch (error) {
      throw new Error(`Error removing from cart: ${error.message}`);
    }
  }

  // Clear entire cart
  async clearCart(userId) {
    try {
      const cart = await Cart.findOne({ where: { userId } });
      if (!cart) {
        // If cart doesn't exist, that's fine - just return success
        return { success: true, message: "Cart already empty" };
      }

      await CartItem.destroy({ where: { cartId: cart.id } });
      return { success: true, message: "Cart cleared" };
    } catch (error) {
      console.error("clearCart error:", error);
      throw new Error(`Error clearing cart: ${error.message}`);
    }
  }

  // Get cart total
  async getCartTotal(userId) {
    try {
      const cart = await Cart.findOne({
        where: { userId },
        include: [
          {
            model: CartItem,
            as: "items",
          },
        ],
      });

      if (!cart || cart.items.length === 0) {
        return 0;
      }

      const total = cart.items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      return total;
    } catch (error) {
      throw new Error(`Error calculating total: ${error.message}`);
    }
  }

  // Get cart item count
  async getCartItemCount(userId) {
    try {
      const cart = await Cart.findOne({ where: { userId } });
      if (!cart) {
        return 0;
      }

      const count = await CartItem.count({ where: { cartId: cart.id } });
      return count;
    } catch (error) {
      throw new Error(`Error getting cart count: ${error.message}`);
    }
  }
}

module.exports = new CartService();

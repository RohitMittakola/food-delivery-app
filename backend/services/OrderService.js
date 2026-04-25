const Order = require("../models/Order");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const FoodItem = require("../models/FoodItem");

class OrderService {
  // Create order from cart
  async createOrderFromCart(userId) {
    try {
      // Get user's cart with items
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

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      // Calculate total and prepare items
      let totalAmount = 0;
      const orderItems = cart.items.map((cartItem) => {
        const itemTotal = parseFloat(cartItem.price) * cartItem.quantity;
        totalAmount += itemTotal;

        return {
          foodItemId: cartItem.foodItemId,
          foodName: cartItem.foodItem.name,
          category: cartItem.foodItem.category,
          calories: cartItem.foodItem.calories,
          price: parseFloat(cartItem.price),
          quantity: cartItem.quantity,
        };
      });

      // Create order
      const order = await Order.create({
        userId,
        totalAmount,
        status: "Pending",
        items: orderItems,
      });

      console.log("Order created:", order.id);
      return order;
    } catch (error) {
      console.error("createOrderFromCart error:", error);
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  // Get all orders for user
  async getUserOrders(userId) {
    try {
      const orders = await Order.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });

      return orders;
    } catch (error) {
      console.error("getUserOrders error:", error);
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    } catch (error) {
      console.error("getOrderById error:", error);
      throw new Error(`Error fetching order: ${error.message}`);
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        throw new Error("Order not found");
      }

      order.status = status;
      await order.save();
      return order;
    } catch (error) {
      console.error("updateOrderStatus error:", error);
      throw new Error(`Error updating order: ${error.message}`);
    }
  }

  // Get order count for user
  async getUserOrderCount(userId) {
    try {
      const count = await Order.count({ where: { userId } });
      return count;
    } catch (error) {
      console.error("getUserOrderCount error:", error);
      throw new Error(`Error getting order count: ${error.message}`);
    }
  }

  // Get total spending for user
  async getUserTotalSpending(userId) {
    try {
      const orders = await Order.findAll({
        where: { userId, status: "Delivered" },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalSpending"],
        ],
        raw: true,
      });

      return parseFloat(orders[0].totalSpending) || 0;
    } catch (error) {
      console.error("getUserTotalSpending error:", error);
      throw new Error(`Error calculating total: ${error.message}`);
    }
  }
}

module.exports = new OrderService();

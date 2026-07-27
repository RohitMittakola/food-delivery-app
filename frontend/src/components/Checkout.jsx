import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = ({ userId }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchCart();
    } else {
      setError("Please login to view your cart");
      setLoading(false);
    }
  }, [userId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://16.16.76.27:5000/api/cart/${userId}`);
      console.log("Cart fetched:", res.data);
      setCart(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Error loading cart");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(cartItemId);
      return;
    }

    try {
      await axios.put(`http://16.16.76.27:5000/api/cart/item/${cartItemId}`, {
        quantity: newQuantity,
      });
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Error updating item");
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await axios.delete(`http://16.16.76.27:5000/api/cart/item/${cartItemId}`);
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Error removing item");
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      try {
        await axios.delete(`http://16.16.76.27:5000/api/cart/clear/${userId}`);
        fetchCart();
      } catch (err) {
        console.error("Error clearing cart:", err);
        setError("Error clearing cart");
      }
    }
  };

  const handleConfirmOrder = () => {
    navigate("/payment", { state: { total: cart.total } });
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading cart...</p>
      </div>
    );
  }

  if (error && cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black text-gray-900 mb-8">Your Cart</h2>
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black text-gray-900 mb-8">🛒 Your Cart</h2>

        {!cart.items || cart.items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              Your cart is empty. Go grab some healthy food!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center pb-4 border-b border-gray-50 hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  >
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900">
                        {item.foodItem.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        ₹{parseFloat(item.price).toFixed(2)} each
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.foodItem.calories} Calories |{" "}
                        {item.foodItem.protein}g Protein
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mr-4">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-3 py-1 rounded transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-3 py-1 rounded transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right mr-4 min-w-20">
                      <p className="font-bold text-gray-900">
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="bg-gray-50 p-6 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-bold text-gray-900">
                    ₹{cart.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-700">Delivery:</span>
                  <span className="font-bold text-gray-900">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-700">
                    Total Amount
                  </span>
                  <span className="text-3xl font-black text-orange-600">
                    ₹{cart.total.toFixed(2)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleConfirmOrder}
                    className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
                  >
                    Order Now →
                  </button>
                  <button
                    onClick={handleClearCart}
                    className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Checkout;

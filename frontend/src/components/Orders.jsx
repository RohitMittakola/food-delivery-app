import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DeliveryMap from "./DeliveryMap";

const Orders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const justOrdered = location.state?.justOrdered || false;

  useEffect(() => {
    if (userId) {
      fetchOrders();
    } else {
      setError("Please login to view your orders");
      setLoading(false);
    }
  }, [userId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/orders/${userId}`);
      console.log("Orders fetched:", res.data);
      setOrders(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return "✓";
      case "Pending":
        return "⏱";
      case "Cancelled":
        return "✕";
      default:
        return "•";
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black text-gray-900 mb-8">
          📋 Your Orders
        </h2>
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900">📋 Your Orders</h2>
          <p className="text-gray-600 mt-2">
            Track and manage your food delivery orders
          </p>
        </div>

        {justOrdered && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-bold text-green-800">Order Placed Successfully!</p>
              <p className="text-sm text-green-600">Your food is being prepared and will arrive soon.</p>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              You haven't placed any orders yet. Start ordering now!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-orange-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Order ID */}
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Order ID
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        #{order.id}
                      </p>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Date</p>
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Status
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600 font-medium">Total</p>
                      <p className="text-2xl font-black text-orange-600">
                        ₹{parseFloat(order.totalAmount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
                    Order Items ({order.items.length})
                  </h3>

                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex-grow">
                          <p className="font-bold text-gray-900">
                            {item.foodName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Category: {item.category} | Calories:{" "}
                            {item.calories}
                          </p>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Qty</p>
                            <p className="font-bold text-gray-900">
                              {item.quantity}x
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="font-bold text-gray-900">
                              ₹{parseFloat(item.price).toFixed(2)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-gray-500">Subtotal</p>
                            <p className="font-bold text-orange-600">
                              ₹
                              {(parseFloat(item.price) * item.quantity).toFixed(
                                2,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-bold text-gray-900">
                        ₹{(parseFloat(order.totalAmount) * 0.95).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700">Delivery:</span>
                      <span className="font-bold text-gray-900">Free</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-bold text-gray-900">Total:</span>
                      <span className="text-2xl font-black text-orange-600">
                        ₹{parseFloat(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {order.status === "Delivered" && (
                    <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                      <button className="flex-1 py-2 px-4 bg-orange-100 text-orange-600 font-bold rounded-lg hover:bg-orange-200 transition-colors">
                        ⭐ Rate Order
                      </button>
                      <button className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">
                        🔄 Reorder
                      </button>
                    </div>
                  )}

                  {(order.status === "Pending" || order.status === "Approved") && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm text-center text-gray-600 mb-6">
                        🚚 Your order is being prepared and will be delivered soon!
                      </p>

                      {/* --- THE LIVE MAP IS INSERTED HERE --- */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-black text-gray-800">Live GPS Tracking</h3>
                          <span className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Connecting to Rider...
                          </span>
                        </div>
                        <DeliveryMap />
                      </div>

                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import ChatWidget from './components/ChatWidget';
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import DietPlan from "./components/DietPlan";
import Menu from "./components/Menu";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import Payment from "./components/Payment";

const Home = () => {
  return (
    <div className="flex flex-col">
      <section className="relative bg-white pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold uppercase tracking-wide text-orange-600">
                  AI-Powered Nutrition
                </span>
                <span className="mt-1 block text-4xl tracking-tight font-black sm:text-5xl xl:text-6xl">
                  <span className="block text-gray-900">Eat Smarter,</span>
                  <span className="block text-orange-600">Live Better.</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                The first food delivery app that understands your body. Get
                personalized meal recommendations based on your BMI and health
                goals.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => (window.location.href = "/menu")}
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-white bg-gray-900 hover:bg-gray-800 md:py-4 md:text-lg md:px-10 transition-all shadow-lg hover:shadow-xl"
                >
                  Order Now
                </button>
                <button
                  onClick={() => (window.location.href = "/diet-plan")}
                  className="inline-flex items-center justify-center px-8 py-3 border border-gray-200 text-base font-bold rounded-full text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all"
                >
                  Check AI Plan
                </button>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-3xl shadow-2xl overflow-hidden">
                <img
                  className="w-full"
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                  alt="Healthy Food"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FEATURES SECTION */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 text-orange-600 font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900">Track BMI</h3>
              <p className="mt-2 text-gray-500">
                Input your health metrics and let our AI do the math.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 text-orange-600 font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Get Recommendations
              </h3>
              <p className="mt-2 text-gray-500">
                Receive a curated menu of foods tailored to your goal.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 text-orange-600 font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900">Eat & Enjoy</h3>
              <p className="mt-2 text-gray-500">
                Order your favorite healthy meals directly to your door.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function App() {
  const [cartCount, setCartCount] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Fetch cart count when component mounts or userId changes
    if (userId) {
      fetchCartCount();
    }
  }, [userId]);

  const fetchCartCount = async () => {
    try {
      const res = await axios.get(
        `http://16.16.76.27:5000/api/cart/count/${userId}`,
      );
      setCartCount(res.data.count);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const addToCart = async (food) => {
    if (!userId) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      await axios.post("http://16.16.76.27:5000/api/cart/add", {
        userId: parseInt(userId),
        foodItemId: food.id,
        quantity: 1,
      });
      fetchCartCount();
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar cartCount={cartCount} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/menu"
            element={<Menu addToCart={addToCart} userId={userId} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/diet-plan" element={<DietPlan addToCart={addToCart} />} />
          <Route path="/checkout" element={<Checkout userId={userId} />} />
          <Route path="/payment" element={<Payment userId={userId} />} />
          <Route path="/orders" element={<Orders userId={userId} />} />
        </Routes>

        {/* ADD THE CHAT WIDGET HERE! */}
        <ChatWidget />

      </div>
    </Router>
  );
}

export default App;
import { useState, useEffect } from "react";
import axios from "axios";

const Menu = ({ addToCart, userId }) => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get("http://16.16.76.27:5000/api/food/");
        console.log("Foods fetched:", res.data);
        setFoods(res.data);
        setFilteredFoods(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching foods", err);
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  // Filter foods by category and search term
  useEffect(() => {
    let filtered = foods;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((food) => food.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((food) =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredFoods(filtered);
  }, [selectedCategory, searchTerm, foods]);

  // Get unique categories
  const categories = ["All", ...new Set(foods.map((f) => f.category))];

  const handleAddToCart = async (food) => {
    if (!userId) {
      setToast({
        show: true,
        message: "Please login to add items to cart",
        type: "error",
      });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
      return;
    }

    try {
      await addToCart(food);
      setToast({
        show: true,
        message: `${food.name} added to cart!`,
        type: "success",
      });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    } catch (error) {
      setToast({ show: true, message: "Error adding to cart", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">
            🍽️ Explore Our Menu
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Healthy, delicious, and AI-approved meals delivered to you
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-6 py-3 rounded-full border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-lg transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === cat
                ? "bg-orange-600 text-white shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-600"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600 font-medium text-lg">
              Loading delicious meals...
            </p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium text-lg">
              No items found 😞
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                  <img
                    src={`https://source.unsplash.com/400x300/?food,${food.name.split(" ")[0]}`}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80";
                    }}
                  />

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {food.category}
                  </span>

                  {/* Sugar Free Badge */}
                  {food.sugarFree && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      ✓ Sugar Free
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-grow flex flex-col">
                  {/* Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {food.name}
                  </h3>

                  {/* Nutrition Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 font-medium">
                        Calories
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {food.calories}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 font-medium">
                        Protein
                      </div>
                      <div className="text-lg font-bold text-orange-600">
                        {food.protein}g
                      </div>
                    </div>
                  </div>

                  {/* Price & Button */}
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <span className="text-3xl font-black text-gray-900">
                      ₹{food.price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(food)}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Items Count */}
        {!loading && (
          <div className="text-center mt-12">
            <p className="text-gray-600 font-medium">
              Showing{" "}
              <span className="text-orange-600 font-bold">
                {filteredFoods.length}
              </span>{" "}
              of{" "}
              <span className="text-orange-600 font-bold">{foods.length}</span>{" "}
              items
            </p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-full font-medium text-white shadow-lg animate-pulse ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Menu;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DietPlan = ({ addToCart }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const [profile, setProfile] = useState({
    age: "",
    gender: "Male",
    height: "",
    weight: "",
    goal: "Weight Loss",
  });
  const [dietData, setDietData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch recommendations when the page loads
  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/recommendations/${userId}`,
      );
      setDietData(res.data);
      setError("");
    } catch (err) {
      if (err.response?.status === 400) {
        setError(
          "Please update your health profile to generate your AI Diet Plan.",
        );
      } else {
        setError("Error fetching recommendations.");
      }
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login"); // Kick them to login if they aren't logged in
    }
  }, [userId, navigate]);

  // Handle saving the health profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/auth/profile/${userId}`,
        profile,
      );
      console.log("Profile update response:", response.data);
      await fetchRecommendations(); // Instantly refresh the diet plan after saving!
      setError(""); // Clear any errors
    } catch (err) {
      console.error("Profile update error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
        "Failed to update profile. Please try again.",
      );
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {userName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Let's get your personalized nutrition plan sorted.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Health Profile Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Your Health Profile
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Height (meters)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={profile.height}
                  required
                  placeholder="e.g. 1.75"
                  className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  onChange={(e) =>
                    setProfile({ ...profile, height: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={profile.weight}
                  required
                  placeholder="e.g. 75"
                  className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  onChange={(e) =>
                    setProfile({ ...profile, weight: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age (optional)
              </label>
              <input
                type="number"
                value={profile.age}
                placeholder="e.g. 25"
                className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                onChange={(e) =>
                  setProfile({ ...profile, age: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Primary Goal
              </label>
              <select
                value={profile.goal}
                required
                className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                onChange={(e) =>
                  setProfile({ ...profile, goal: e.target.value })
                }
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Diabetic-Friendly">Diabetic-Friendly</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full text-white bg-orange-600 hover:bg-orange-700 font-medium transition-colors"
            >
              {loading ? "Loading..." : "Show Related Food"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: AI Recommendations Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          {dietData ? (
            <>
              {/* BMI Stats Card */}
              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex items-center justify-between">
                <div>
                  <h3 className="text-orange-800 font-bold text-lg">
                    Your Body Mass Index (BMI)
                  </h3>
                  <p className="text-orange-600 mt-1">Goal: {dietData.goal}</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-orange-600">
                    {dietData.bmi}
                  </span>
                  <p className="text-sm font-medium text-orange-800 uppercase tracking-wider">
                    {dietData.status}
                  </p>
                </div>
              </div>

              {/* Food Grid */}
              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                Recommended Meals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dietData.recommendedFoods.length > 0 ? (
                  dietData.recommendedFoods.map((food, index) => (
                    <div
                      key={index}
                      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 text-lg">
                            {food.name}
                          </h4>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            {food.category}
                          </span>
                        </div>
                        <div className="flex space-x-4 text-sm text-gray-600 mt-4 mb-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">
                              {food.calories}
                            </span>{" "}
                            Calories
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">
                              {food.protein}g
                            </span>{" "}
                            Protein
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">
                              ₹{food.price}
                            </span>{" "}
                            Price
                          </div>
                        </div>
                      </div>

                      {/* THE NEW ADD TO CART BUTTON */}
                      <button
                        onClick={() => addToCart(food)}
                        className="w-full mt-2 bg-gray-900 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition-colors duration-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500">
                    No foods found for this specific goal yet. Try adding some
                    from the admin panel!
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center flex flex-col items-center justify-center h-full">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <h3 className="text-xl font-medium text-gray-900">
                Enter your details
              </h3>
              <p className="text-gray-500 mt-2">
                Fill in your health profile on the left and click "Show Related
                Food" to see personalized recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietPlan;
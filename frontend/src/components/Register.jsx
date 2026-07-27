import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://16.16.76.27:5000/api/auth/register", formData);
      navigate("/login"); // Send them to login after successful signup!
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join BroBite to get AI diet plans
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="Rohit Srinivas"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none transition-colors"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-orange-600 hover:text-orange-500"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

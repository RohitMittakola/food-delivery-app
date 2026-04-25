import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import brobitelogo from "../assets/brobite.png";

const Navbar = ({ cartCount }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={brobitelogo} alt="BroBite" className="h-12 w-auto object-contain" />
              <span className="text-2xl font-black tracking-tight">
                Bro<span className="text-orange-600">Bite.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-600 hover:text-orange-600 font-medium">Home</Link>
            <Link to="/menu" className="text-gray-600 hover:text-orange-600 font-medium">Menu</Link>

            {token && (
              <>
                <Link to="/diet-plan" className="text-gray-600 hover:text-orange-600 font-medium">AI Diet Plan</Link>
                <Link to="/checkout" className="relative text-gray-600 hover:text-orange-600 font-medium">
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="text-gray-600 hover:text-orange-600 font-medium">Orders</Link>
              </>
            )}
          </div>

          {/* Desktop Right Side Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <>
                <span className="text-sm font-bold text-gray-800">
                  Hi, {userName ? userName.split(" ")[0] : "User"}
                </span>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 font-medium ml-4">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-orange-600 font-medium">Log in</Link>
                <Link to="/register" className="bg-orange-600 text-white px-5 py-2 rounded-full font-medium hover:bg-orange-700">Sign up</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-orange-600 focus:outline-none"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50">Home</Link>
            <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50">Menu</Link>

            {token ? (
              <>
                <Link to="/diet-plan" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50">AI Diet Plan</Link>
                <Link to="/checkout" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                  Cart {cartCount > 0 && <span className="ml-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full">{cartCount}</span>}
                </Link>
                <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50">Orders</Link>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <span className="block px-3 py-2 text-base font-bold text-gray-800">Hi, {userName ? userName.split(" ")[0] : "User"}</span>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 mt-2 pt-2 flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50">Log in</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-center rounded-md text-base font-medium bg-orange-600 text-white hover:bg-orange-700">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
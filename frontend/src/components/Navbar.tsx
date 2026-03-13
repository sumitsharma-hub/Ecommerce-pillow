import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { clearCart } from "../features/cart/cartSlice";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartItemCount = cart.items.length;

  const handleLogout = () => {
    dispatch(clearCart());
    dispatch(logout());
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/img/logo-natural-plus.png"
              alt="Natural Plus"
              className="h-12 w-24"
            />
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-green-800">
                Natural Plus
              </span>
              <p className="text-[10px] text-gray-500 tracking-wide">
                AYURVEDIC WELLNESS
              </p>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-1">

            {/* Track Order — shown for guests only, hidden when logged in
                (logged-in users use My Orders in the profile dropdown)    */}
            {!user && (
              <Link
                to="/track-order"
                title="Track your order"
                className="relative p-2 rounded-xl text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors"
              >
                <LocalShippingOutlinedIcon />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors"
            >
              <ShoppingCartOutlinedIcon />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-700 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* ================= DESKTOP ================= */}
            {user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 bg-green-50 px-2 py-1.5 rounded-full border border-green-100"
                >
                  <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <ExpandMoreIcon
                    className={`text-gray-500 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-green-100 shadow-lg z-20">
                      <div className="px-4 py-2 text-xs text-gray-700 font-semibold">
                        {user.name} <br />
                        <span className="text-[11px] text-gray-500">
                          {user.email}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-green-50"
                      >
                        <PersonOutlineIcon fontSize="small" />
                        My Profile
                      </Link>
                      <Link
                        to="/my-orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex gap-2 px-4 py-2 text-sm hover:bg-green-50"
                      >
                        <img src="img/package.png" alt="" className="w-4.5" />
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogoutIcon fontSize="small" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-green-700 px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-green-700 hover:bg-green-800 px-4 py-1.5 rounded-full transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* ================= MOBILE HAMBURGER ================= */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 rounded-xl hover:bg-green-50"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-t border-green-100 px-4 py-4 space-y-3">
          {!user ? (
            <>
              {/* Track order in mobile menu for guests */}
              <Link
                to="/track-order"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 text-sm"
              >
                <LocalShippingOutlinedIcon fontSize="small" />
                Track My Order
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-center py-2 border border-green-200 rounded-xl text-gray-700 hover:bg-green-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block text-center py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="px-4 flex-col items-center justify-center py-2 text-xs text-gray-700 font-semibold">
                <span>
                  {user.name} <br />
                </span>
                <span className="text-[11px] text-gray-500">{user.email}</span>
              </div>
              <Link
                to="/profile"
                className="w-full flex justify-center items-center gap-3 px-4 py-2 text-sm hover:bg-green-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <PersonOutlineIcon fontSize="small" />
                My Profile
              </Link>
              <Link
                to="/my-orders"
                className="w-full flex justify-center items-center gap-3 px-4 py-2 text-sm hover:bg-green-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <img src="img/package.png" alt="" className="w-4.5" />
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full py-2 gap-2 text-center text-red-600 rounded-xl hover:bg-red-50"
              >
                <LogoutIcon fontSize="small" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
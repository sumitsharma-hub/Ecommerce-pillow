import { Outlet, Navigate, NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import type { RootState } from "../../app/store";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function AdminLayout() {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingBagIcon /> },
    { name: "Products", path: "/admin/products", icon: <Inventory2Icon /> },
    { name: "Analytics", path: "/admin/analytics", icon: <BarChartIcon /> },
  ];

  const isActivePath = (path: string) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white/95 backdrop-blur-xl
        border-r border-green-100 transition-all duration-300
        ${isSidebarOpen ? "w-64" : "w-20 overflow-hidden"}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-green-100">
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg flex items-center justify-center text-white">
              <img src="/img/green-guce-logo.png" alt="" />
            </div>

            {isSidebarOpen && (
              <div>
                <h1 className="font-bold text-xl text-gray-900">
                  Natural Plus
                </h1>
                <p className="text-xs text-green-600 font-medium">Admin</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 space-y-2">
          {navItems.map((item) => {
            const active = isActivePath(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={`flex items-center py-3 rounded-xl transition-all duration-300 font-medium group
                ${
                  isSidebarOpen
                    ? "gap-3 px-4"
                    : "justify-center px-0"
                }
                ${
                  active
                    ? "bg-linear-to-r from-green-500 to-emerald-600 text-white"
                    : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <span
                  className={`text-lg transition-colors ${
                    active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-green-600"
                  }`}
                >
                  {item.icon}
                </span>

                {isSidebarOpen && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <div className="absolute bottom-[2%] left-0 right-0 px-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center py-3 rounded-xl
            text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all"
          >
            <svg
              className={`w-5 h-5 transition-transform ${
                isSidebarOpen ? "" : "rotate-180"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>

            {isSidebarOpen && <span className="ml-2">Collapse</span>}
          </button>
        </div>

        {/* User Card */}
        <div className="absolute bottom-[8%] left-0 right-0 flex justify-center px-3">
          <div className="w-full bg-linear-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-12 h-12 bg-linear-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.[0]?.toUpperCase()}
              </div>

              {isSidebarOpen && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => dispatch(logout())}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Logout"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

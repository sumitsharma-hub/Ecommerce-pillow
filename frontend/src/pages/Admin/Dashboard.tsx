import { useGetDashboardStatsQuery } from "../../features/admin/adminApi";
import ContentPasteRoundedIcon from "@mui/icons-material/ContentPasteRounded";
import CurrencyExchangeRoundedIcon from "@mui/icons-material/CurrencyExchangeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';

type RecentActivityItem = {
  id: number;
  type: "order" | "payment" | "user" | "product";
  title: string;
  subtitle: string;
  createdAt: string;
};


export default function Dashboard() {
  const { data, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-100">
          <svg
            className="w-12 h-12 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-600 font-medium">
            Failed to load dashboard data
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Orders",
      value: data.totalOrders,
      icon: <ContentPasteRoundedIcon />,
      gradient: "from-violet-500 to-violet-600",
      bgGradient: "from-violet-50 to-violet-100",
      shadowColor: "shadow-violet-200",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Total Revenue",
      value: `₹${(data.revenue ?? 0).toLocaleString()}`,
      icon: <CurrencyExchangeRoundedIcon />,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-100",
      shadowColor: "shadow-emerald-200",
      trend: "+8.2%",
      trendUp: true,
    },
    {
      label: "Total Users",
      value: data.totalUsers,
      icon: <GroupsRoundedIcon />,
      gradient: "from-rose-500 to-pink-600",
      bgGradient: "from-rose-50 to-pink-100",
      shadowColor: "shadow-rose-200",
      trend: "+24%",
      trendUp: true,
    },
    {
      label: "Pending Orders",
      value: data.pendingOrders ?? 0,
      icon: <AccessTimeRoundedIcon />,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-100",
      shadowColor: "shadow-amber-200",
      trend: "-5%",
      trendUp: false,
    },
  ];
  const renderActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return (
          <ShoppingBagOutlinedIcon />
        );

      case "payment":
        return (
          <CheckCircleOutlineRoundedIcon />
        );

      case "user":
        return (
          <PersonAddAltOutlinedIcon />
        );

      default: // product / admin
        return (
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
              d="M20 7l-8-4-8 4m16 0l-8 4
               m8-4v10l-8 4
               m0-10L4 7
               m8 4v10
               M4 7v10l8 4"
            />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-sm flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export
          </button>
          <button className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl hover:from-violet-600 hover:to-violet-700 shadow-lg shadow-violet-200 hover:shadow-xl transition-all font-medium text-sm flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} p-6 rounded-2xl border border-white/50 shadow-lg ${stat.shadowColor} hover:shadow-xl transition-all duration-300 group`}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg flex items-center justify-center text-white`}
                >
                  {stat.icon}
                </div>
                <span
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trendUp ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {stat.trendUp ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                      />
                    </svg>
                  )}
                  {stat.trend}
                </span>
              </div>

              <p className="text-gray-600 text-sm font-medium mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
            <button className="text-violet-600 text-sm font-medium hover:text-violet-700">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {data.recentActivity.map((item: RecentActivityItem, index: number) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.type === "order"
                      ? "bg-violet-100 text-violet-600"
                      : item.type === "payment"
                      ? "bg-emerald-100 text-emerald-600"
                      : item.type === "user"
                      ? "bg-rose-100 text-rose-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {/* SAME ICON LOGIC YOU ALREADY HAVE */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.type === "order"
                        ? "bg-violet-100 text-violet-600"
                        : item.type === "payment"
                        ? "bg-emerald-100 text-emerald-600"
                        : item.type === "user"
                        ? "bg-rose-100 text-rose-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {renderActivityIcon(item.type)}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{item.title}</p>
                  <p className="text-gray-500 text-sm">{item.subtitle}</p>
                </div>

                <span className="text-gray-400 text-sm">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

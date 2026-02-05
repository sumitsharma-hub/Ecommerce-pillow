import { useGetDashboardStatsQuery } from "../../features/admin/adminApi";
import ContentPasteRoundedIcon from "@mui/icons-material/ContentPasteRounded";
import CurrencyExchangeRoundedIcon from "@mui/icons-material/CurrencyExchangeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

export default function Dashboard() {
  const { data, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Fetching live stats...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100">
        <p className="text-red-600 font-bold">Error loading dashboard. Please check your connection.</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Orders",
      value: data.totalOrders,
      icon: <ContentPasteRoundedIcon />,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      trend: "+12%"
    },
    {
      label: "Revenue",
      value: `₹${(data.revenue ?? 0).toLocaleString()}`,
      icon: <CurrencyExchangeRoundedIcon />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      trend: "+8.2%"
    },
    {
      label: "Total Users",
      value: data.totalUsers,
      icon: <GroupsRoundedIcon />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      trend: "+24%"
    },
    {
      label: "Pending",
      value: data.pendingOrders ?? 0,
      icon: <AccessTimeRoundedIcon />,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
      trend: "Active"
    },
  ];

  const renderActivityIcon = (type: string) => {
    const iconClass = "p-2 rounded-lg";
    switch (type) {
      case "order": return <div className={`${iconClass} bg-green-100 text-green-600`}><ShoppingBagOutlinedIcon fontSize="small" /></div>;
      case "payment": return <div className={`${iconClass} bg-emerald-100 text-emerald-600`}><CheckCircleOutlineRoundedIcon fontSize="small" /></div>;
      case "user": return <div className={`${iconClass} bg-blue-100 text-blue-600`}><PersonAddAltOutlinedIcon fontSize="small" /></div>;
      default: return <div className={`${iconClass} bg-gray-100 text-gray-600`}><TrendingUpIcon fontSize="small" /></div>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 font-medium">Overview of your natural wellness business.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`p-6 bg-white rounded-3xl border ${stat.border} shadow-sm hover:shadow-md transition-all`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>{stat.icon}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-gray-500 text-sm font-semibold">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <button className="text-green-700 font-bold text-sm hover:underline">View All</button>
        </div>
        <div className="divide-y divide-gray-100">
          {data.recentActivity.map((item: any, idx: number) => (
            <div key={idx} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
              {renderActivityIcon(item.type)}
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-bold truncate">{item.title}</p>
                <p className="text-gray-500 text-sm truncate">{item.subtitle}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <p className="text-[10px] text-gray-400">
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
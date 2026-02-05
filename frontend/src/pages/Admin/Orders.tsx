import { useState } from "react";
import {
  useGetOrdersQuery,
  useUpdateTrackingMutation,
  useDownloadSlipMutation,
} from "../../features/admin/adminApi";
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import DoneIcon from '@mui/icons-material/Done';
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const { data: orders = [], isLoading } = useGetOrdersQuery();
  const [updateTracking, { isLoading: isUpdating }] = useUpdateTrackingMutation();
  const [downloadSlip] = useDownloadSlipMutation();

  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [trackingFilterStatus, setTrackingFilterStatus] = useState("all");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  const handleSubmitTracking = async () => {
    if (!selectedOrderNumber) return;

    await updateTracking({
      orderId: selectedOrderNumber,
      courierName,
      trackingNumber,
      status,
    });

    setSelectedOrderNumber(null);
    setCourierName("");
    setTrackingNumber("");
    setStatus("");
  };

  const handleEditTracking = (order: any) => {
    setSelectedOrderNumber(order.orderNumber);
    if (order.tracking) {
      setCourierName(order.tracking.courierName || "");
      setTrackingNumber(order.tracking.trackingNumber || "");
      setStatus(order.tracking.status || "");
    } else {
      setCourierName("");
      setTrackingNumber("");
      setStatus("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "delivered":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "shipped":
      case "in_transit":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-700";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.totalAmount?.toString().includes(searchQuery);

    const matchesOrderFilter =
      filterStatus === "all" ||
      (order.paymentStatus && order.paymentStatus.toLowerCase() === filterStatus);

    const matchesTrackingFilter =
      trackingFilterStatus === "all" ||
      (order.tracking?.status && order.tracking.status.toLowerCase() === trackingFilterStatus);

    return matchesSearch && matchesOrderFilter && matchesTrackingFilter;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setTrackingFilterStatus("all");
  };

  const selectedOrder = orders.find((o: any) => o.orderNumber === selectedOrderNumber);

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track customer orders</p>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 transition-all text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 transition-all text-sm text-gray-700"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={trackingFilterStatus}
            onChange={(e) => setTrackingFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 transition-all text-sm text-gray-700"
          >
            <option value="all">All Tracking</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
          </select>
          <button onClick={clearFilters} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all" title="Clear filters">
            <ClearIcon fontSize="small" />
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-sm">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-all">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{order.orderNumber}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-gray-800">₹{order.totalAmount?.toLocaleString()}</p>
                    {order.tracking ? (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">{order.tracking.courierName}</span> · Tracking: {order.tracking.trackingNumber}
                        {order.tracking.status && (
                          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(order.tracking.status)}`}>
                            {order.tracking.status}
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic mt-1">No tracking info</p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-sm">
                      <Link to={`/admin/orders/${order.id}`} className="text-emerald-600 hover:underline">View Details</Link>
                      {order.slipDownloadedAt && (
                        <span className="text-gray-500 flex items-center gap-1">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Slip downloaded {new Date(order.slipDownloadedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-start md:self-center">
                  <button onClick={() => downloadSlip(order.id)} className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Download Slip">
                    <DownloadIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => handleEditTracking(order)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-sm flex items-center gap-1"
                  >
                    <FmdGoodOutlinedIcon fontSize="small" />
                    Update Tracking
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tracking Update Modal */}
      {selectedOrderNumber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <button onClick={() => setSelectedOrderNumber(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Update Tracking - {selectedOrder?.orderNumber}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Courier Name</label>
                <input
                  type="text"
                  placeholder="e.g., BlueDart"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tracking Number</label>
                <input
                  type="text"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 transition-all text-gray-700"
                >
                  <option value="">Select status</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setSelectedOrderNumber(null)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                Cancel
              </button>
              <button
                onClick={handleSubmitTracking}
                disabled={isUpdating}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <DoneIcon fontSize="small" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
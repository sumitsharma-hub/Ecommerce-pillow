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




export default function AdminOrders() {
  const { data: orders = [], isLoading } = useGetOrdersQuery();
  const [updateTracking, { isLoading: isUpdating }] =
    useUpdateTrackingMutation();
  const [downloadSlip] = useDownloadSlipMutation();

  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(
    null
  );
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [trackingFilterStatus, setTrackingFilterStatus] = useState("all"); // NEW

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
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
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "shipped":
      case "in_transit":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.totalAmount?.toString().includes(searchQuery);

    const matchesOrderFilter =
      filterStatus === "all" ||
      (order.paymentStatus &&
        order.paymentStatus.toLowerCase() === filterStatus);

    const matchesTrackingFilter =
      trackingFilterStatus === "all" ||
      (order.tracking?.status &&
        order.tracking.status.toLowerCase() === trackingFilterStatus);

    return matchesSearch && matchesOrderFilter && matchesTrackingFilter;
  });

  const clearFilters = () => {
    setSearchQuery("");          // existing
    setFilterStatus("all");      // existing
    setTrackingFilterStatus("all"); // NEW
  };

  const selectedOrder = orders.find(
    (o: any) => o.orderNumber === selectedOrderNumber
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Orders
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm flex items-center gap-2">
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
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by Order Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-gray-700"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={trackingFilterStatus}
            onChange={(e) => setTrackingFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-gray-700"
          >
            <option value="all">All Tracking Status</option>
            <option value="shipped">Shipped</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
          </select>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
          >
            <ClearIcon/>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order: any) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-violet-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-800">
                        {order.orderNumber}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mb-2">
                      ₹{order.totalAmount?.toLocaleString()}
                    </p>

                    {order.tracking && (
                      <div className="flex items-center gap-2 mt-3 p-3 bg-blue-50 rounded-xl">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            {order.tracking.courierName}
                          </p>
                          <p className="text-xs text-blue-600">
                            Tracking: {order.tracking.trackingNumber}
                          </p>
                          {order.tracking.status && (
                            <p className="text-xs text-blue-600">
                              Status: {order.tracking.status}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {order.slipDownloadedAt && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                        <svg
                          className="w-3 h-3 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Slip downloaded{" "}
                        {new Date(order.slipDownloadedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => downloadSlip(order.id)}
                    className="p-2.5 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                    title="Download Slip"
                  >
                    <DownloadIcon/>
                  </button>
                  <button
                    onClick={() => handleEditTracking(order)}
                    className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-violet-200 hover:shadow-xl transition-all font-medium text-sm flex items-center gap-2"
                  >
                    <FmdGoodOutlinedIcon/>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSelectedOrderNumber(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedOrderNumber(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Update Tracking
              </h2>
              <p className="text-gray-500">{selectedOrder?.orderNumber}</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Courier Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., BlueDart, DTDC, FedEx"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-gray-700"
                >
                  <option value="">Select status</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setSelectedOrderNumber(null)}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTracking}
                disabled={isUpdating}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-violet-200 hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <DoneIcon/>
                    Save Tracking
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

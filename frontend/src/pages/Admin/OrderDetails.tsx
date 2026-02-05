import { useParams, Link } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../features/admin/adminApi";
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';

export default function AdminOrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading } = useGetOrderDetailsQuery(Number(orderId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Order not found</p>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-emerald-700 transition-colors font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </Link>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Order {order.orderNumber}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <span
            className={`px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(order.paymentStatus)}`}
          >
            {order.paymentStatus}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-bold text-gray-800">₹{order.totalAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <p className="font-bold text-gray-800">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Razorpay ID</p>
            <p className="font-bold text-gray-800">{order.razorpayOrderId || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Customer and Shipping */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Customer & Shipping</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-2">Account Details</p>
            <p className="text-gray-800">{order.user?.name}</p>
            <p className="text-gray-600">{order.user?.email}</p>
            <p className="text-gray-600">{order.user?.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-2">Shipping Details</p>
            <p className="text-gray-800">{order.name}</p>
            <p className="text-gray-600">{order.phone}</p>
            <p className="text-gray-600 flex items-center gap-2">
              <FmdGoodOutlinedIcon className="w-5 h-5 text-emerald-600" />
              {order.address}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Order Items</h3>
        <div className="space-y-4">
          {order.items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0"
            >
              {item.product.images[0] && (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${item.product.images[0].url}`}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.product.name}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-500">Price: ₹{item.price.toLocaleString()}</p>
              </div>
              <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tracking */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Tracking Information</h3>
        {order.tracking ? (
          <div className="space-y-2">
            <p className="text-gray-600 flex items-center gap-2">
              <span className="font-medium text-emerald-700">Courier:</span> {order.tracking.courierName}
            </p>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="font-medium text-emerald-700">Tracking Number:</span> {order.tracking.trackingNumber}
            </p>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="font-medium text-emerald-700">Status:</span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.tracking.status)}`}>
                {order.tracking.status}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-gray-500 italic">No tracking information available yet.</p>
        )}
      </div>
    </div>
  );
}
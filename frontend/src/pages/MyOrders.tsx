import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../features/order/orderApi";

export default function MyOrders() {
  const { data: orders = [], isLoading } = useGetMyOrdersQuery();

  if (isLoading) {
    return <div className="flex justify-center py-20">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">You haven’t placed any orders yet.</p>
        <Link to="/" className="text-green-700 font-semibold">
          Start Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white border rounded-2xl p-5 shadow-sm space-y-4"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-gray-800">
                {order.orderNumber}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-gray-800">
                ₹{order.totalAmount.toLocaleString()}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-4 text-sm"
              >
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${item.product.images?.[0]?.url}`}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-lg object-cover border"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {item.product.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-gray-700">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Tracking (inline, compact) */}
          {order.tracking && (
            <div className="flex flex-wrap items-center gap-3 text-sm bg-gray-50 px-4 py-3 rounded-xl">
              <span className="font-medium text-gray-700">
                Courier:
                <span className="ml-1 text-gray-900">
                  {order.tracking.courierName}
                </span>
              </span>

              <span className="text-gray-500">|</span>

              <span className="text-gray-700">
                Tracking:
                <span className="ml-1 font-medium">
                  {order.tracking.trackingNumber}
                </span>
              </span>

              <span className="text-gray-500">|</span>

              <button
                onClick={() =>
                  window.open("https://shreenandancourier.com/", "_blank")
                }
                className="text-green-700 font-semibold hover:underline"
              >
                Track Order →
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

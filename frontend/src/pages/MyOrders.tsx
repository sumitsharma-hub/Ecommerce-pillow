import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../features/order/orderApi";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";
import { CheckCircleOutline } from "@mui/icons-material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

export default function MyOrders() {
  const { data: orders = [], isLoading } = useGetMyOrdersQuery();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 text-gray-500">
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <p className="text-gray-500 text-lg">
          You haven’t placed any orders yet.
        </p>
        <Link
          to="/"
          className="inline-block bg-green-700 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-green-800 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* ORDER HEADER */}
          <div className="flex flex-wrap justify-between items-center gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Order</p>
              <p className="font-semibold text-gray-900">
                {order.orderNumber}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <p className="text-xl font-bold text-gray-800">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </p>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 uppercase tracking-wide">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="px-6 py-5 space-y-4">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-5 border-b last:border-none pb-4 last:pb-0"
              >
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${item.product.images?.[0]?.url}`}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover border border-gray-100 shadow-sm"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-gray-800 text-sm">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>

          {/* TRACKING SECTION */}
          <div className="px-6 pb-6">
            <div className="bg-gray-50 rounded-xl px-4 py-4 flex flex-wrap items-center gap-4 text-sm">
              {order.tracking ? (
                <>
                  <div className="flex items-center gap-2 text-gray-700">
                    <LocalShippingOutlinedIcon fontSize="small" />
                    <span>
                      Courier:
                      <span className="ml-1 font-semibold text-gray-900">
                        {order.tracking.courierName}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">
                      Tracking:
                      <span className="ml-1 font-semibold text-gray-900">
                        {order.tracking.trackingNumber}
                      </span>
                    </span>

                    {copiedId === order.tracking.trackingNumber ? (
                      <CheckCircleOutline
                        className="text-green-500"
                        fontSize="small"
                      />
                    ) : (
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            order.tracking.trackingNumber
                          );
                          setCopiedId(order.tracking.trackingNumber);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className="p-1 rounded hover:bg-green-100 transition"
                      >
                        <ContentCopyIcon
                          fontSize="small"
                          className="text-gray-500"
                        />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      window.open("https://shreenandancourier.com/", "_blank")
                    }
                    className="ml-auto bg-green-50 text-green-700 font-semibold px-4 py-1.5 rounded-lg hover:bg-green-100 transition"
                  >
                    Track Order →
                  </button>
                </>
              ) : (
                <p className="text-gray-500 text-sm">
                  Tracking details will appear here once your order is shipped.
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
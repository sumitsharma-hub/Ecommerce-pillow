import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useLazyTrackGuestOrderQuery } from "../features/order/orderApi";
import { useAppSelector } from "../app/hooks";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CheckCircleOutline } from "@mui/icons-material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";

export default function TrackMyOrder() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [orderNumber, setOrderNumber] = useState(
    searchParams.get("orderNumber") ?? ""
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { user } = useAppSelector((state) => state.auth);

  const [triggerTrack, { data: order, isLoading, isError, error }] =
    useLazyTrackGuestOrderQuery();

  const arrivedFromEmail =
    !!searchParams.get("email") && !!searchParams.get("orderNumber");

  useEffect(() => {
    if (arrivedFromEmail) {
      triggerTrack({ email, orderNumber });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim() && orderNumber.trim()) {
      triggerTrack({ email: email.trim(), orderNumber: orderNumber.trim() });
    }
  }

  // Loading skeleton
  if (isLoading && arrivedFromEmail) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
        <div className="bg-white border rounded-2xl p-5 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
          <div className="h-10 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-gray-800">Track Your Order</h1>
        {!arrivedFromEmail && (
          <p className="text-gray-500 text-sm">
            Enter your email and order number to view your order details.
          </p>
        )}
      </div>

      {/* Lookup Form — hidden when auto-loaded from email link */}
      {!arrivedFromEmail && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Order Number
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. ORD-20240101-XXXX"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {isLoading ? "Searching..." : "Track Order"}
          </button>
        </form>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm text-center space-y-2">
          <p>
            {(error as any)?.data?.message ??
              "No order found. Please check your email and order number."}
          </p>
          {arrivedFromEmail && (
            <button
              onClick={() => window.location.replace("/track-order")}
              className="text-sm font-semibold underline text-red-700 hover:text-red-800"
            >
              Try searching manually
            </button>
          )}
        </div>
      )}

      {/* Order Result */}
      {order && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-5">

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <p className="font-bold text-gray-900 text-base">
                {order.orderNumber}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-800">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 uppercase tracking-wide">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${item.product.images?.[0]?.url}`}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm leading-snug truncate">
                    {item.product.name}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-gray-700 text-sm shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>

          {/* Tracking Info */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm space-y-3">
            {order.tracking ? (
              <>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                      Courier
                    </p>
                    <p className="font-semibold text-gray-800">
                      {order.tracking.courierName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                      Tracking Number
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-gray-800">
                        {order.tracking.trackingNumber}
                      </span>
                      {copiedId === order.tracking.trackingNumber ? (
                        <CheckCircleOutline
                          className="text-green-500"
                          fontSize="small"
                        />
                      ) : (
                        <button
                          type="button"
                          className="p-1 rounded hover:bg-green-100 transition"
                          onClick={async () => {
                            await navigator.clipboard.writeText(
                              order.tracking.trackingNumber
                            );
                            setCopiedId(order.tracking.trackingNumber);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          title="Copy tracking number"
                        >
                          <ContentCopyIcon
                            fontSize="small"
                            className="text-gray-400 hover:text-gray-600"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    window.open("https://shreenandancourier.com/", "_blank")
                  }
                  className="w-full text-center text-sm text-green-700 font-semibold bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg py-2 transition"
                >
                  Track on Courier Site →
                </button>
              </>
            ) : (
              <p className="text-gray-400 text-sm text-center py-1">
                Tracking details will appear here once your order is shipped.
              </p>
            )}
          </div>

          {/* ── Account CTA ───────────────────────────────────────────
              • Logged-in user: no CTA needed, they already have an account
              • Guest user: show both Login + Register options
          ─────────────────────────────────────────────────────────── */}
          {!user && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 space-y-3">
              <p className="text-sm text-center text-gray-600 font-medium">
                Save your orders & track them anytime
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to={`/login?redirect=/track-order&email=${encodeURIComponent(email)}&orderNumber=${encodeURIComponent(order.orderNumber)}`}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-green-700 text-green-700 font-semibold text-sm hover:bg-green-50 transition"
                >
                  <LoginOutlinedIcon fontSize="small" />
                  Login
                </Link>
                <Link
                  to={`/register?redirect=/track-order&email=${encodeURIComponent(email)}&orderNumber=${encodeURIComponent(order.orderNumber)}`}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold text-sm transition"
                >
                  <PersonAddOutlinedIcon fontSize="small" />
                  Create Account
                </Link>
              </div>
              <p className="text-xs text-center text-gray-400">
                Use the same email address to link this order to your account.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Escape hatch for email-link flow */}
      {arrivedFromEmail && order && (
        <p className="text-center text-xs text-gray-400">
          Not your order?{" "}
          <button
            onClick={() => window.location.replace("/track-order")}
            className="underline hover:text-gray-600"
          >
            Search a different order
          </button>
        </p>
      )}
    </div>
  );
}
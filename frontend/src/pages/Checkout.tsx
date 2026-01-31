// Checkout.tsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import {
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
} from "../features/order/orderApi";
import { loadRazorpay } from "../utils/razorpay";
import type { RootState } from "../app/store";
import { selectCartTotalAmount } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../features/cart/cartSlice";

type PaymentMethod = "COD" | "ONLINE";

export default function Checkout() {
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector(selectCartTotalAmount);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ONLINE");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [createOrder, { isLoading: codLoading }] = useCreateOrderMutation();
  const [createRazorpayOrder, { isLoading: razorpayLoading }] =
    useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      alert("Cart is empty");
      return;
    }

    if (paymentMethod === "COD") {
      await handleCODOrder();
    } else {
      await handleOnlinePayment();
    }
  };

  const handleCODOrder = async () => {
    try {
      await createOrder({
        name: form.name,
        phone: form.phone,
        address: form.address,
        paymentMethod: "COD",
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      }).unwrap();

      dispatch(clearCart());
      navigate("/order-success", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Failed to place COD order");
    }
  };

  const handleOnlinePayment = async () => {
    try {
      const orderRes = await createOrder({
        name: form.name,
        phone: form.phone,
        address: form.address,
        paymentMethod: "UPI",
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      }).unwrap();

      const razorpayRes = await createRazorpayOrder({
        orderId: orderRes.orderId,
      }).unwrap();

      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const options = {
        key: razorpayRes.key,
        amount: razorpayRes.amount,
        currency: razorpayRes.currency,
        order_id: razorpayRes.razorpayOrderId,
        name: "My Store",
        description: "Order Payment",
        handler: async (response: any) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            dispatch(clearCart());
            navigate("/order-success", { replace: true });
          } catch (error) {
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#7c3aed" },
      };

      new (window as any).Razorpay(options).open();
    } catch (error) {
      console.error(error);
      alert("Unable to initiate payment");
    }
  };

  const loading = codLoading || razorpayLoading;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          No items to checkout
        </h2>
        <p className="text-gray-500 mb-6">Add some items to your cart first.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1 mb-4"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Checkout
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none resize-none"
                placeholder="Enter your full shipping address..."
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "ONLINE"
                      ? "border-violet-500 bg-violet-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={() => setPaymentMethod("ONLINE")}
                    className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">
                      Online Payment
                    </span>
                    <p className="text-sm text-gray-500">
                      Pay securely via Razorpay
                    </p>
                  </div>
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate pr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-800 font-medium flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-6 w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === "COD" ? "Place Order" : "Pay Now"}
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

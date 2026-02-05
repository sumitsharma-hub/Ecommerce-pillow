import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import {
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
} from "../features/order/orderApi";
import { loadRazorpay } from "../utils/razorpay";
import type { RootState } from "../app/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../features/cart/cartSlice";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CreditCardIcon from "@mui/icons-material/CreditCard";

type PaymentMethod = "COD" | "ONLINE";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isBuyNow = location.state?.buyNow;
  const buyNowProduct = location.state?.product;

  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const items = isBuyNow ? [buyNowProduct] : cartItems;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (isBuyNow && !buyNowProduct) {
    return <Navigate to="/" replace />;
  }

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

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!items.length) {
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
        items: items.map((item) => ({
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
        items: items.map((item) => ({
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
        name: "Natural Plus",
        description: "Ayurvedic Wellness Order",
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
        theme: { color: "#166534" }, // green-700
      };

      (window as any).Razorpay(options).open();
    } catch (error) {
      console.error(error);
      alert("Unable to initiate payment");
    }
  };

  const loading = codLoading || razorpayLoading;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          No items to checkout
        </h2>
        <p className="text-gray-500 mb-8 text-center">
          Add some items to your cart first.
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-green-700 hover:text-green-800 font-medium mb-4"
          >
            <ArrowBackIosNewIcon fontSize="small" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCardIcon className="text-green-600" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Shipping Address *
              </h2>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-vertical"
                placeholder="Enter your complete shipping address..."
              />
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Payment Method
              </h2>
              <label
                className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all w-full ${
                  paymentMethod === "ONLINE"
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-green-200 hover:border-green-300 hover:shadow-sm"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                  className="w-5 h-5 text-green-600 focus:ring-green-500"
                />
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 text-lg">
                    Online Payment
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    Secure payment via Razorpay (Cards, UPI, Wallets)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm py-2"
                  >
                    <span className="text-gray-700 truncate">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="text-gray-900">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="border-t border-green-200 mt-6 pt-6">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-green-700">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !form.name || !form.phone || !form.address}
                className="mt-8 w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === "COD"
                      ? "Place Order (COD)"
                      : "Pay Now Securely"}
                    <ArrowForwardIcon fontSize="small" />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
                By placing your order, you agree to our{" "}
                <Link
                  to="#"
                  className="text-green-700 hover:underline font-medium"
                >
                  Terms & Conditions
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

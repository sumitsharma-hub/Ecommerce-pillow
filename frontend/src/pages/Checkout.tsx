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

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  locality: string;
  state: string;
  pincode: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  locality?: string;
  state?: string;
  pincode?: string;
}

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
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );

  if (isBuyNow && !buyNowProduct) {
    return <Navigate to="/" replace />;
  }

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ONLINE");
  const [stateSearch, setStateSearch] = useState("");
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    locality: "",
    state: "",
    pincode: "",
  });

  const [createOrder, { isLoading: codLoading }] = useCreateOrderMutation();
  const [createRazorpayOrder, { isLoading: razorpayLoading }] =
    useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const filteredStates = INDIAN_STATES.filter((s) =>
    s.toLowerCase().includes(stateSearch.toLowerCase()),
  );

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (data: FormState): FormErrors => {
    const e: FormErrors = {};

    if (!data.name.trim()) {
      e.name = "Full name is required";
    } else if (data.name.trim().length < 2) {
      e.name = "Name must be at least 2 characters";
    }

    if (!data.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      e.email = "Enter a valid email address";
    }

    if (!data.phone.trim()) {
      e.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(data.phone.replace(/\s+/g, ""))) {
      e.phone = "Enter a valid 10-digit Indian mobile number";
    }

    if (!data.addressLine1.trim()) {
      e.addressLine1 = "Address Line 1 is required";
    }
    if (!data.addressLine2.trim()) {
      e.addressLine2 = "Address Line 2 is required";
    }
    if (!data.locality.trim()) {
      e.locality = "Locality / City is required";
    }
    if (!data.state) {
      e.state = "Please select a state";
    }
    if (!data.pincode.trim()) {
      e.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(data.pincode)) {
      e.pincode = "Enter a valid 6-digit pincode";
    }

    return e;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (touched[e.target.name as keyof FormState]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  };

  const handleStateSelect = (state: string) => {
    const updated = { ...form, state };
    setForm(updated);
    setStateSearch(state);
    setShowStateDropdown(false);
    setTouched((prev) => ({ ...prev, state: true }));
    setErrors(validate(updated));
  };

  const buildAddressString = () =>
    [
      form.addressLine1,
      form.addressLine2,
      form.locality,
      form.state,
      form.pincode,
    ]
      .filter(Boolean)
      .join(", ");

  // ── Shared input className helper ────────────────────────────────────────
  const inputCls = (field: keyof FormErrors) =>
    `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
      touched[field] && errors[field]
        ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400"
        : "border-green-200"
    }`;

  const ErrorMsg = ({ field }: { field: keyof FormErrors }) =>
    touched[field] && errors[field] ? (
      <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
    ) : null;

  // ── Order handlers ───────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    // Mark all required fields as touched so errors show
    setTouched({
      name: true,
      email: true,
      phone: true,
      addressLine1: true,
      addressLine2: true,
      locality: true,
      state: true,
      pincode: true,
    });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

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
        address: buildAddressString(),
        paymentMethod: "COD",
        items: items.map((item: any) => ({
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
        address: buildAddressString(),
        paymentMethod: "UPI",
        items: items.map((item: any) => ({
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
          } catch {
            alert("Payment verification failed");
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#166534" },
      };

      (window as any).Razorpay(options).open();
    } catch (error) {
      console.error(error);
      alert("Unable to initiate payment");
    }
  };

  const loading = codLoading || razorpayLoading;

  // ── Empty cart guard ─────────────────────────────────────────────────────
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

  // ── Render ───────────────────────────────────────────────────────────────
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
          {/* ── Left Column: Forms ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCardIcon className="text-green-600" />
                Contact Information
              </h2>
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("name")}
                    className={inputCls("name")}
                    placeholder="John Doe"
                  />
                  <ErrorMsg field="name" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      className={inputCls("email")}
                      placeholder="john@example.com"
                    />
                    <ErrorMsg field="email" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur("phone")}
                      className={inputCls("phone")}
                      placeholder="98765 43210"
                      maxLength={10}
                    />
                    <ErrorMsg field="phone" />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Shipping Address
              </h2>

              <div className="space-y-4">
                {/* Address Line 1 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleChange}
                    onBlur={() => handleBlur("addressLine1")}
                    className={inputCls("addressLine1")}
                    placeholder="House / Flat no., Building name, Street"
                  />
                  <ErrorMsg field="addressLine1" />
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address Line 2 <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="addressLine2"
                    value={form.addressLine2}
                    onChange={handleChange}
                    onBlur={() => handleBlur("addressLine2")}
                    className={inputCls("addressLine2")}
                    placeholder="Apartment, area, landmark"
                  />
                  <ErrorMsg field="addressLine2" />
                </div>

                {/* Locality & Pincode */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Locality */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Locality / City <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="locality"
                      value={form.locality}
                      onChange={handleChange}
                      onBlur={() => handleBlur("locality")}
                      className={inputCls("locality")}
                      placeholder="e.g. Andheri West"
                    />
                    <ErrorMsg field="locality" />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      onBlur={() => handleBlur("pincode")}
                      className={inputCls("pincode")}
                      placeholder="400001"
                      maxLength={6}
                    />
                    <ErrorMsg field="pincode" />
                  </div>
                </div>

                {/* State — searchable dropdown */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={stateSearch}
                    onChange={(e) => {
                      setStateSearch(e.target.value);
                      // Clear selected state if user edits the text
                      if (form.state && e.target.value !== form.state) {
                        const updated = { ...form, state: "" };
                        setForm(updated);
                        if (touched.state) setErrors(validate(updated));
                      }
                      setShowStateDropdown(true);
                    }}
                    onFocus={() => setShowStateDropdown(true)}
                    onBlur={() => {
                      // Delay to allow click on dropdown item
                      setTimeout(() => {
                        setShowStateDropdown(false);
                        handleBlur("state");
                        // If typed text doesn't match a selected state, clear it
                        if (!form.state) setStateSearch("");
                      }, 150);
                    }}
                    placeholder="Search state..."
                    className={inputCls("state")}
                  />

                  {/* Selected state tick */}
                  {form.state && (
                    <span className="absolute right-4 top-[42px] text-green-600 text-sm font-medium pointer-events-none">
                      ✓
                    </span>
                  )}

                  <ErrorMsg field="state" />

                  {/* Dropdown list */}
                  {showStateDropdown && filteredStates.length > 0 && (
                    <ul className="absolute z-50 w-full mt-1 bg-white border border-green-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                      {filteredStates.map((state) => (
                        <li
                          key={state}
                          onMouseDown={() => handleStateSelect(state)}
                          className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                            form.state === state
                              ? "bg-green-50 text-green-700 font-semibold"
                              : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                          }`}
                        >
                          {state}
                        </li>
                      ))}
                    </ul>
                  )}

                  {showStateDropdown && filteredStates.length === 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-green-200 rounded-xl shadow-lg px-4 py-3 text-sm text-gray-500">
                      No state found
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Payment Method
              </h2>
              <label
                className={`flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all w-full ${
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
                  className="mt-1 w-5 h-5 text-green-600 focus:ring-green-500"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <span className="font-semibold text-gray-900 text-lg">
                      Razorpay Secure
                    </span>

                    {/* Payment Icons */}
                    <div className="flex items-center gap-2">
                      <img
                        src="/img/upi-icon.svg"
                        alt="UPI"
                        className="h-5"
                      />
                      <img
                        src="/img/gpay-icon.svg"
                        alt="GPay"
                        className="h-4"
                      />
                      <img
                        src="/img/paytm-icon.svg"
                        alt="paytm"
                        className="h-4"
                      />
                      <img
                        src="/img/phonepe-1.svg"
                        alt="PhonePe"
                        className="h-5"
                      />
                      <img
                        src="/img/visa-icon.svg"
                        alt="Visa"
                        className="h-4"
                      />
                      <img
                        src="/img/mastercard-icon.svg"
                        alt="Mastercard"
                        className="h-5"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    Pay securely via UPI, Credit/Debit Cards, Netbanking &
                    Wallets. You will be redirected to Razorpay to complete
                    payment.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* ── Right Column: Order Summary ─────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
                {items.map((item: any) => (
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
                disabled={loading}
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

// Cart.tsx
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { removeFromCart, updateQuantity } from "../features/cart/cartSlice";
import { Link, Navigate } from "react-router-dom";

export default function Cart() {
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Shopping Cart
          <span className="text-base font-normal text-gray-500 ml-2">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Cart Items */}
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={`${baseUrl}${item.imageUrl}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                  <p className="text-violet-600 font-medium mt-1">₹{item.price.toLocaleString()}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() =>
                          dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-sm text-red-500 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Footer */}
          <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Shipping</span>
              <span className="text-sm text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
            </div>

            <Link
              to="/checkout"
              className="mt-6 w-full block text-center bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/"
              className="mt-3 w-full block text-center text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
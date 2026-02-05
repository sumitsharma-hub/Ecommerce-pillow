import { useAppDispatch, useAppSelector } from "../app/hooks";
import { removeFromCart, updateQuantity } from "../features/cart/cartSlice";
import { Link, Navigate } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
          <ShoppingCartOutlinedIcon className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added anything yet.
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Shopping Cart
          <span className="text-lg font-normal text-gray-500 ml-2">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
          {/* Items */}
          <div className="divide-y divide-green-50">
            {items.map((item) => (
              <div key={item.id} className="p-6 flex gap-6">
                {/* Image */}
                <div className="w-24 h-24 bg-green-50 rounded-xl flex-shrink-0 overflow-hidden border border-green-100">
                  {item.imageUrl ? (
                    <img
                      src={`${baseUrl}${item.imageUrl}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-100">
                      <ShoppingCartOutlinedIcon className="w-8 h-8 text-green-500" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 truncate">{item.name}</h3>
                  <p className="text-green-700 font-bold text-lg mt-1">
                    ₹{item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-green-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))
                        }
                        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-green-700 hover:bg-green-50 transition-colors font-semibold text-lg"
                      >
                        −
                      </button>
                      <span className="w-12 text-center text-lg font-bold px-4 py-3 border-x border-green-200 bg-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                        }
                        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-green-700 hover:bg-green-50 transition-colors font-semibold text-lg"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="text-right font-bold text-xl text-green-700 min-w-[100px]">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-green-50 p-8 border-t border-green-100">
            <div className="flex justify-between items-center mb-4 text-lg">
              <span className="text-gray-700 font-semibold">Subtotal</span>
              <span className="font-bold text-gray-900 text-xl">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-lg">
              <span className="text-gray-700">Shipping</span>
              <span className="text-green-600 font-bold text-lg">Free</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-green-200 text-2xl">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-green-700">₹{total.toLocaleString()}</span>
            </div>

            <Link
              to="/checkout"
              className="mt-8 w-full block text-center bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/"
              className="mt-4 w-full block text-center text-green-700 hover:text-green-800 font-semibold py-3 border border-green-200 rounded-xl hover:bg-green-50 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
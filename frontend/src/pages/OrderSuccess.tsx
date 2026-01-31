import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 5000); // 5 sec auto redirect

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-gray-500 mb-6">
          Thank you for your purchase. You will be redirected to the home page shortly.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
        >
          Go to Home
        </Link>

        <p className="text-xs text-gray-400 mt-4">
          Redirecting automatically in 5 seconds...
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../features/auth/authApi";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [forgotPassword] = useForgotPasswordMutation();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await forgotPassword({ email: email.trim() }).unwrap();

      navigate("/verify-reset-otp", {
        state: {
          email: email.trim().toLowerCase(),
          otpSentVia: "email",
        },
      });
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl p-4 mx-auto mb-4 shadow-lg">
            <EmailIcon className="text-green-700" style={{ fontSize: 40 }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600">
            Enter your registered email and we'll send you a reset OTP.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <EmailIcon fontSize="small" className="text-green-600" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your registered email"
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-semibold"
          >
            <ArrowBackIcon fontSize="small" />
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
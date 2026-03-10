import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useVerifyResetOtpMutation, useForgotPasswordMutation } from "../features/auth/authApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function VerifyResetOtp() {
  const { state } = useLocation();
  const email: string = state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  const [verifyOtp] = useVerifyResetOtpMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const navigate = useNavigate();

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await verifyOtp({ email, otp }).unwrap();

      navigate("/reset-password", {
        state: { email, otp },
      });
    } catch (err: any) {
      setError(err?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setCanResend(false);
    setTimer(300);

    try {
      await forgotPassword({ email }).unwrap();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to resend OTP.");
      setCanResend(true);
    }
  }

  const minutes = Math.floor(timer / 60);
  const seconds = String(timer % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
          <p className="text-gray-600">
            We sent a 6-digit OTP to{" "}
            <span className="font-semibold text-gray-800">{email}</span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Enter OTP
              </label>
              <input
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(val);
                }}
                required
                placeholder="------"
                inputMode="numeric"
                maxLength={6}
                className="w-full text-center text-2xl tracking-[0.5em] px-4 py-4 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            {/* Timer */}
            <p className="text-sm text-gray-500 text-center">
              OTP expires in{" "}
              <span className="font-semibold text-gray-700">
                {minutes}:{seconds}
              </span>
            </p>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

            {/* Resend */}
            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-green-700 hover:text-green-800 font-semibold"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-gray-400">
                  Didn't receive it? Resend available when timer expires.
                </p>
              )}
            </div>
          </form>
        </div>

        <p className="text-center mt-8">
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-semibold"
          >
            <ArrowBackIcon fontSize="small" />
            Try a different email
          </Link>
        </p>
      </div>
    </div>
  );
}
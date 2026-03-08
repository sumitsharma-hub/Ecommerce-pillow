import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import KeyIcon from "@mui/icons-material/VpnKey";
import {
  useVerifyResetOtpMutation,
  useForgotPasswordMutation,
} from "../features/auth/authApi";

export default function VerifyResetOtp() {
  const { state } = useLocation();
  const identifier: string = state?.identifier || "";
  const otpSentVia: string = state?.otpSentVia || "sms";
  const sessionId: string | null = state?.sessionId || null;
  const isSettingNewPassword: boolean = state?.isSettingNewPassword || false;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const [verifyOtp] = useVerifyResetOtpMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!identifier) {
      navigate("/forgot-password");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [identifier, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await verifyOtp({
        identifier,
        otp,
        ...(sessionId && { sessionId }),
      }).unwrap();

      navigate("/reset-password", {
        state: {
          identifier,
          otp,
          sessionId,
          isSettingNewPassword,
        },
      });
    } catch (err: any) {
      setError(err?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setCanResend(false);
    setTimer(300);

    try {
      await forgotPassword({
        identifier,
        ...(isSettingNewPassword && { setNewPassword: true }),
      }).unwrap();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to resend OTP");
      setCanResend(true);
    }
  }

  const sentToLabel =
    otpSentVia === "email"
      ? `OTP sent to your email: ${identifier}`
      : `OTP sent via SMS to: ${identifier}`;

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl p-4 mx-auto mb-4 shadow-lg">
            <KeyIcon className="text-green-700" style={{ fontSize: 40 }} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSettingNewPassword ? "Set Password" : "Reset Password"}
          </h1>
          <p className="text-gray-600">Verify OTP to continue</p>
          <p className="text-sm text-gray-500 mt-1">{sentToLabel}</p>
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
                placeholder="Enter 6-digit OTP"
                inputMode="numeric"
                maxLength={6}
                className="w-full text-center text-xl tracking-widest px-4 py-4 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>

            <p className="text-sm text-gray-500 text-center">
              OTP expires in{" "}
              <span className="font-semibold text-gray-700">
                {Math.floor(timer / 60)}:
                {String(timer % 60).padStart(2, "0")}
              </span>
            </p>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            <button
              disabled={isLoading || otp.length < 6}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Resend */}
            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-green-700 hover:text-green-800 font-medium"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-gray-400">
                  Resend available when timer expires
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
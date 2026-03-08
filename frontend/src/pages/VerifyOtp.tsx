import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useVerifyOtpMutation,
  useSendOtpMutation,
} from "../features/auth/authApi";
import { useAppDispatch } from "../app/hooks";
import { loginSuccess } from "../features/auth/authSlice";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const identifier: string = state?.identifier || "";
  const identifierType: "email" | "phone" = state?.identifierType || "phone";
  const isNewUser: boolean = state?.isNewUser || false;
  const otpSentVia: "sms" | "email" = state?.otpSentVia || "sms";

  const [sessionId, setSessionId] = useState<string | null>(
    state?.sessionId || null
  );
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [verifyOtp] = useVerifyOtpMutation();
  const [sendOtp] = useSendOtpMutation();

  // Countdown timer for resend
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

  // Redirect if no identifier
  useEffect(() => {
    if (!identifier) {
      navigate("/login");
    }
  }, [identifier, navigate]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res: any = await verifyOtp({
        identifier,
        otp,
        sessionId,
      }).unwrap();

      if (res.isNewUser) {
        // New user → go to complete profile
        navigate("/complete-profile", {
          state: {
            identifier,
            identifierType,
          },
        });
      } else {
        // Existing user → login
        dispatch(loginSuccess(res));

        if (res.user?.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (err: any) {
      setError(err?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setCanResend(false);
    setTimer(60);

    try {
      const res: any = await sendOtp({ identifier }).unwrap();
      if (res.sessionId) {
        setSessionId(res.sessionId);
      }
    } catch (err: any) {
      setError(err?.data?.message || "Failed to resend OTP");
      setCanResend(true);
    }
  }

  const sentToLabel =
    otpSentVia === "sms"
      ? `SMS sent to ${identifier}`
      : `Email sent to ${identifier}`;

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
          <p className="text-gray-600">{sentToLabel}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8">
          <form onSubmit={handleVerify} className="space-y-6">
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
                <p className="text-sm text-gray-500">
                  Resend OTP in {timer}s
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
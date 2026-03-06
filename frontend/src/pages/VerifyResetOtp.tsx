import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import KeyIcon from "@mui/icons-material/VpnKey";
import { useVerifyResetOtpMutation } from "../features/auth/authApi";

export default function VerifyResetOtp() {
  const { state } = useLocation();
  const email = state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const [verifyOtp] = useVerifyResetOtpMutation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [timer, setTimer] = useState(300);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await verifyOtp({ email, otp }).unwrap();

      navigate("/reset-password", { state: { email, otp } });
    } catch (err: any) {
      setError(err?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl p-4 mx-auto mb-4 shadow-lg">
            <KeyIcon className="text-green-700" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>

          <p className="text-gray-600">Enter the OTP sent to {email}</p>
        </div>

        {/* Card */}

        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter OTP"
              className="w-full text-center text-xl tracking-widest px-4 py-4 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500"
            />
            <p className="text-sm text-gray-500 text-center">
              OTP expires in {Math.floor(timer / 60)}:{timer % 60}
            </p>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            <button
              disabled={isLoading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

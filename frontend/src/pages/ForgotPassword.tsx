import { useState } from "react";
import { useForgotPasswordMutation } from "../features/auth/authApi";
import { useNavigate, Link } from "react-router-dom";
import PhoneIcon from "@mui/icons-material/Phone";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noPasswordAccount, setNoPasswordAccount] = useState(false);

  const [forgotPassword] = useForgotPasswordMutation();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNoPasswordAccount(false);
    setIsLoading(true);

    try {
      const res: any = await forgotPassword({
        identifier: identifier.trim(),
      }).unwrap();

      // Navigate to verify OTP page on success
      navigate("/verify-reset-otp", {
        state: {
          identifier: identifier.trim(),
          otpSentVia: res.otpSentVia || "sms",
          sessionId: res.sessionId || null,
        },
      });
    } catch (err: any) {
      const message = err?.data?.message || "Something went wrong";

      // Detect "no password" accounts (signed up via OTP only)
      if (
        message.toLowerCase().includes("no password") ||
        message.toLowerCase().includes("otp login")
      ) {
        setNoPasswordAccount(true);
      } else {
        setError(message);
      }
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
            <span className="text-4xl">🔐</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password
          </h1>

          <p className="text-gray-600">
            Enter your email or mobile number to receive an OTP
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <PhoneIcon fontSize="small" className="text-green-600" />
                Email or Mobile Number
              </label>

              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setNoPasswordAccount(false);
                  setError("");
                }}
                placeholder="Enter email or 10-digit mobile"
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            {/* No-password account info box */}
            {noPasswordAccount && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                <div className="flex items-start gap-2">
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="text-amber-600 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      No password set
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      This account was created using OTP login and doesn't have
                      a password yet. You can either:
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pl-6">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition-all"
                  >
                    Log in with OTP
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      setNoPasswordAccount(false);
                      setError("");
                      setIsLoading(true);

                      try {
                        const res: any = await forgotPassword({
                          identifier: identifier.trim(),
                          setNewPassword: true,
                        }).unwrap();

                        navigate("/verify-reset-otp", {
                          state: {
                            identifier: identifier.trim(),
                            otpSentVia: res.otpSentVia || "sms",
                            sessionId: res.sessionId || null,
                            isSettingNewPassword: true,
                          },
                        });
                      } catch (err: any) {
                        setError(
                          err?.data?.message || "Failed to send OTP"
                        );
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="inline-flex items-center justify-center px-4 py-2.5 bg-white border border-green-300 hover:bg-green-50 text-green-800 text-sm font-semibold rounded-lg transition-all"
                  >
                    Set a new password
                  </button>
                </div>
              </div>
            )}

            {/* Generic error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            <button
              disabled={isLoading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-green-700 hover:text-green-800 font-medium"
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
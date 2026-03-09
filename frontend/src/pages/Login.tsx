import { useState } from "react";
import {
  useIdentifyMutation,
  useLoginMutation,
  useSendOtpMutation,
} from "../features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { loginSuccess } from "../features/auth/authSlice";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type Step = "identifier" | "auth";

interface IdentifyResult {
  isExistingUser: boolean;
  hasPassword: boolean;
  isAdmin: boolean;
  maskedEmail?: string;
  maskedPhone?: string;
  identifier: string;
  identifierType: "email" | "phone";
}

export default function Login() {
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [identifyResult, setIdentifyResult] = useState<IdentifyResult | null>(
    null
  );

  const [identify] = useIdentifyMutation();
  const [loginApi] = useLoginMutation();
  const [sendOtp] = useSendOtpMutation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // ── Step 1: Enter identifier and click Continue ──

  async function handleIdentify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res: any = await identify({ identifier: identifier.trim() }).unwrap();
      setIdentifyResult(res);

      if (!res.isExistingUser) {
        // New user → send OTP directly for verification
        const otpRes: any = await sendOtp({
          identifier: identifier.trim(),
        }).unwrap();

        navigate("/verify-otp", {
          state: {
            identifier: identifier.trim(),
            identifierType: res.identifierType,
            sessionId: otpRes.sessionId || null,
            otpSentVia: otpRes.otpSentVia,
            isNewUser: true,
          },
        });
      } else {
        // Existing user → show auth options
        setStep("auth");
      }
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Step 2a: Password login ──

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res: any = await loginApi({
        identifier: identifier.trim(),
        password,
      }).unwrap();

      dispatch(loginSuccess(res));

      if (res.user?.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Step 2b: OTP login ──

  async function handleOtpLogin() {
    setError("");
    setIsLoading(true);

    try {
      const otpRes: any = await sendOtp({
        identifier: identifier.trim(),
      }).unwrap();

      navigate("/verify-otp", {
        state: {
          identifier: identifier.trim(),
          identifierType: identifyResult?.identifierType,
          sessionId: otpRes.sessionId || null,
          otpSentVia: otpRes.otpSentVia,
          isNewUser: false,
        },
      });
    } catch (err: any) {
      setError(err?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Go back to step 1 ──

  function handleBack() {
    setStep("identifier");
    setPassword("");
    setError("");
    setIdentifyResult(null);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-40 h-25  p-4 mx-auto mb-4">
            <img src="/img/logo-natural-plus.png" alt=""  className="w-full h-full"/>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === "identifier" ? "Login / Sign Up" : "Welcome Back"}
          </h1>

          <p className="text-gray-600">
            {step === "identifier"
              ? "Enter your email or mobile number"
              : `Logging in as ${identifier}`}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8">
          {/* ─── STEP 1: Identifier Input ─── */}
          {step === "identifier" && (
            <form onSubmit={handleIdentify} className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <PhoneIcon fontSize="small" className="text-green-600" />
                  Email or Mobile Number
                </label>

                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="Enter email or 10-digit mobile"
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700 text-center">{error}</p>
                </div>
              )}

              <button
                disabled={isLoading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? "Please wait..." : "Continue"}
              </button>
            </form>
          )}

          {/* ─── STEP 2: Auth Options (existing user) ─── */}
          {step === "auth" && identifyResult && (
            <div className="space-y-6">
              {/* Back button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-medium"
              >
                <ArrowBackIcon fontSize="small" />
                Change
              </button>

              {/* Identifier display */}
              <div className="bg-green-50 rounded-xl p-3 flex items-center gap-3">
                {identifyResult.identifierType === "phone" ? (
                  <PhoneIcon className="text-green-600" />
                ) : (
                  <EmailIcon className="text-green-600" />
                )}
                <span className="font-medium text-gray-800">{identifier}</span>
              </div>

              {/* Password form (shown if user has password) */}
              {identifyResult.hasPassword && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <LockIcon fontSize="small" className="text-green-600" />
                      Password
                    </label>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-700 text-center">
                        {error}
                      </p>
                    </div>
                  )}

                  <button
                    disabled={isLoading}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </button>

                  {/* Forgot password link */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-sm text-green-700 hover:text-green-800 font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>
              )}

              {/* OTP option — hidden for admin */}
              {!identifyResult.isAdmin && (
                <>
                  {identifyResult.hasPassword && (
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-4 text-gray-500">OR</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleOtpLogin}
                    disabled={isLoading}
                    className={`w-full font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all ${
                      identifyResult.hasPassword
                        ? "bg-white border-2 border-green-700 text-green-700 hover:bg-green-50"
                        : "bg-green-700 hover:bg-green-800 text-white"
                    }`}
                  >
                    {isLoading ? "Sending OTP..." : "Login with OTP"}
                  </button>
                </>
              )}

              {/* If admin and no password — edge case message */}
              {identifyResult.isAdmin && !identifyResult.hasPassword && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800 text-center">
                    Admin accounts require a password. Please contact support to
                    set one up.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useCreateAccountMutation } from "../features/auth/authApi";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { loginSuccess } from "../features/auth/authSlice";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function CompleteProfile() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const identifier: string = state?.identifier || "";
  const identifierType: "email" | "phone" = state?.identifierType || "phone";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(identifierType === "email" ? identifier : "");
  const [phone, setPhone] = useState(identifierType === "phone" ? identifier : "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [createAccount] = useCreateAccountMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res: any = await createAccount({
        identifier,
        identifierType,
        name: name.trim(),
        email: identifierType === "email" ? identifier : email.trim() || undefined,
        phone: identifierType === "phone" ? identifier : phone.trim() || undefined,
        password: password || undefined,
      }).unwrap();

      dispatch(loginSuccess(res));
      navigate("/");
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl p-4 mx-auto mb-4 shadow-lg">
            <PersonIcon className="text-green-700" style={{ fontSize: 40 }} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>

          <p className="text-gray-600">Just a few details to get started</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name — mandatory */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            {/* Email — show if user signed up with phone */}
            {identifierType === "phone" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
            )}

            {/* Phone — show if user signed up with email */}
            {identifierType === "email" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mobile Number{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
            )}

            {/* Password — optional */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Set a password for faster login"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                You can always login with OTP if you skip this
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            <button
              disabled={isLoading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
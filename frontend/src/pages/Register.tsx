import { useState } from "react";
import { useRegisterMutation } from "../features/auth/authApi";
import { useAppDispatch } from "../app/hooks";
import { loginSuccess } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [register] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = form;
      const res: any = await register(registerData).unwrap();
      dispatch(loginSuccess(res));
      if (res.user?.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl p-4 mx-auto mb-4 shadow-lg">
            <span className="text-4xl"><img src="img/logo-natural-plus.png" alt="" /></span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join Natural Plus for pure wellness</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <PersonIcon fontSize="small" className="text-green-600" />
                Full Name *
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <EmailIcon fontSize="small" className="text-green-600" />
                Email Address *
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <PhoneIcon fontSize="small" className="text-green-600" />
                  Phone *
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <LockIcon fontSize="small" className="text-green-600" />
                  Password *
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <CheckCircleIcon fontSize="small" className="text-green-600" />
                  Confirm Password *
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start gap-3 p-1">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 h-5 w-5 text-green-600 focus:ring-green-500 border-green-300 rounded"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer flex-1">
                I agree to the{" "}
                <Link to="/terms" className="text-green-700 hover:text-green-800 font-semibold">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-green-700 hover:text-green-800 font-semibold">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-8 text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-700 hover:text-green-800 font-bold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
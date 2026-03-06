import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../features/auth/authApi";
import LockIcon from "@mui/icons-material/Lock";

export default function ResetPassword() {

  const { state } = useLocation();
  const email = state?.email;
  const otp = state?.otp;

  const navigate = useNavigate();

  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [error,setError] = useState("");

  const [resetPassword] = useResetPasswordMutation();

  const [isLoading,setIsLoading] = useState(false);

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    setError("");

    if(password !== confirmPassword){
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try{

      await resetPassword({
        email,
        otp,
        password
      }).unwrap();

      navigate("/login");

    }catch(err:any){

      setError(err?.data?.message || "Failed to reset password");

    }finally{
      setIsLoading(false);
    }
  }

  return (

    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Header */}

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl p-4 mx-auto mb-4 shadow-lg">
            <LockIcon className="text-green-700"/>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>

          <p className="text-gray-600">
            Enter your new password
          </p>

        </div>

        {/* Card */}

        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500"
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            <button
              disabled={isLoading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? "Updating..." : "Reset Password"}
            </button>

          </form>

        </div>

      </div>

    </div>

  );
}
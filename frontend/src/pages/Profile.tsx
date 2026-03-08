import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginSuccess } from "../features/auth/authSlice";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useGetProfileQuery, useUpdateProfileMutation } from "../features/user/userApi";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  const { data, isLoading: isProfileLoading, error: profileError } = useGetProfileQuery(undefined, {
    skip: !token,
  });
  const [updateProfile] = useUpdateProfileMutation();

  const profile = data?.user;

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI state
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSaveField = async (field: string) => {
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const payload: any = {};

      if (field === "name") {
        if (!name.trim()) {
          setError("Name cannot be empty");
          setIsSaving(false);
          return;
        }
        payload.name = name.trim();
      // Email editing removed
      } else if (field === "phone") {
        if (phone.trim() && !/^\d{10}$/.test(phone.trim())) {
          setError("Phone number must be 10 digits");
          setIsSaving(false);
          return;
        }
        payload.phone = phone.trim();
      }

      const res: any = await updateProfile(payload).unwrap();

      // Update the auth state so navbar reflects changes
      dispatch(
        loginSuccess({
          user: res.user,
          token: token ?? "",
        })
      );

      setSuccess(res.message || "Updated successfully");
      setEditingField(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to update");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSaving(true);

    try {
      const payload: any = { newPassword };
      if (profile?.hasPassword) {
        if (!currentPassword) {
          setError("Current password is required");
          setIsSaving(false);
          return;
        }
        payload.currentPassword = currentPassword;
      }

      const res: any = await updateProfile(payload).unwrap();

      dispatch(
        loginSuccess({
          user: res.user,
          token: token ?? "",
        })
      );

      setSuccess(
        profile?.hasPassword
          ? "Password updated successfully"
          : "Password set successfully"
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordSectionOpen(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = (field: string) => {
    if (field === "name") setName(profile?.name || "");
    if (field === "phone") setPhone(profile?.phone || "");
    setEditingField(null);
    setError("");
  };

  const handleCancelPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordSectionOpen(false);
    setError("");
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 max-w-md w-full text-center">
          <p className="text-red-600 mb-4">Failed to load profile</p>
          <button
            onClick={() => navigate("/")}
            className="text-green-700 font-semibold hover:text-green-800"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-medium mb-6"
        >
          <ArrowBackIcon fontSize="small" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-bold text-green-700">
              {profile?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">My Profile</h1>
          <p className="text-gray-500">Manage your account details</p>
        </div>

        {/* Success / Error banners */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-700 text-center">{success}</p>
          </div>
        )}

        {error && editingField === null && !isPasswordSectionOpen && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700 text-center">{error}</p>
          </div>
        )}

        {/* Profile Fields Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 divide-y divide-green-50">
          {/* ── Name ── */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <PersonIcon fontSize="small" className="text-green-600" />
                Name
              </label>
              {editingField !== "name" && (
                <button
                  onClick={() => {
                    setEditingField("name");
                    setError("");
                  }}
                  className="text-green-700 hover:text-green-800"
                >
                  <EditIcon fontSize="small" />
                </button>
              )}
            </div>

            {editingField === "name" ? (
              <div className="space-y-3 mt-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-red-600">{error}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveField("name")}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 disabled:opacity-50 transition-all"
                  >
                    <CheckIcon fontSize="small" />
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => handleCancelEdit("name")}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <CloseIcon fontSize="small" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-800 mt-1">{profile?.name || "—"}</p>
            )}
          </div>

          {/* ── Email ── */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <EmailIcon fontSize="small" className="text-green-600" />
                Email
              </label>
            </div>
            <p className="text-gray-800 mt-1">
              {profile?.email || (
                <span className="text-gray-400 italic">Not added yet</span>
              )}
            </p>
          </div>

          {/* ── Phone ── */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <PhoneIcon fontSize="small" className="text-green-600" />
                Mobile Number
              </label>
              {editingField !== "phone" && (
                <button
                  onClick={() => {
                    setEditingField("phone");
                    setError("");
                  }}
                  className="text-green-700 hover:text-green-800"
                >
                  <EditIcon fontSize="small" />
                </button>
              )}
            </div>

            {editingField === "phone" ? (
              <div className="space-y-3 mt-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-red-600">{error}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveField("phone")}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 disabled:opacity-50 transition-all"
                  >
                    <CheckIcon fontSize="small" />
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => handleCancelEdit("phone")}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <CloseIcon fontSize="small" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-800 mt-1">
                {profile?.phone || (
                  <span className="text-gray-400 italic">Not added yet</span>
                )}
              </p>
            )}
          </div>

          {/* ── Password ── */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <LockIcon fontSize="small" className="text-green-600" />
                Password
              </label>
              {!isPasswordSectionOpen && (
                <button
                  onClick={() => {
                    setIsPasswordSectionOpen(true);
                    setError("");
                  }}
                  className="text-green-700 hover:text-green-800"
                >
                  <EditIcon fontSize="small" />
                </button>
              )}
            </div>

            {!isPasswordSectionOpen ? (
              <p className="text-gray-800 mt-1">
                {profile?.hasPassword ? (
                  "••••••••"
                ) : (
                  <span className="text-gray-400 italic">
                    No password set — you can add one for faster login
                  </span>
                )}
              </p>
            ) : (
              <form onSubmit={handleSavePassword} className="space-y-4 mt-3">
                {/* Current password — only if user already has one */}
                {profile?.hasPassword && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 pr-12 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showCurrentPassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-3 pr-12 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-3 pr-12 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-600">{error}</p>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-1 px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 disabled:opacity-50 transition-all"
                  >
                    <CheckIcon fontSize="small" />
                    {isSaving
                      ? "Saving..."
                      : profile?.hasPassword
                        ? "Update Password"
                        : "Set Password"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelPassword}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <CloseIcon fontSize="small" />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Account info footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Account created{" "}
          {profile?.createdAt
            ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "—"}
        </p>
      </div>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  Camera,
  Save,
  Shield,
  Clock,
  Edit3,
  Key,
  Bell,
  Globe,
  Briefcase,
  AlertTriangle,
  Check,
} from "lucide-react";
import {
  apiGetMe,
  apiUpdateMe,
  apiChangePassword,
  type UserProfile,
} from "@/lib/api-client";

export function ManagerProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Editable form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [restaurantName, setRestaurantName] = useState("");

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setErrorMessage("");
        const me = await apiGetMe();
        if (!active) return;
        setProfile(me);
        setFullName(me.fullName || "");
        setPhone(me.phone || "");
        setRestaurantName(me.restaurantName || "");
      } catch (err) {
        if (active)
          setErrorMessage(
            err instanceof Error ? err.message : "Failed to load profile",
          );
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMessage("");
      const updated = await apiUpdateMe({
        fullName: fullName || undefined,
        phone: phone || undefined,
        restaurantName: restaurantName || undefined,
      });
      setProfile(updated);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      setPasswordError("Both fields are required");
      return;
    }
    try {
      setChangingPassword(true);
      setPasswordError("");
      setPasswordSuccess("");
      await apiChangePassword({ currentPassword, newPassword });
      setPasswordSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-sm text-gray-500 shadow-sm">
        Loading profile...
      </div>
    );
  }

  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "MG";

  const joinedDate = profile
    ? new Date(
        (profile as UserProfile & { createdAt?: string }).createdAt ??
          Date.now(),
      ).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0E3442] text-2xl" style={{ fontWeight: 700 }}>
            My Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account information and preferences
          </p>
        </div>
        <div className="flex gap-3">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditing(false);
                  setErrorMessage("");
                }}
                className="px-4 py-2.5 rounded-xl text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors shadow-sm disabled:opacity-60"
                style={{ fontWeight: 600 }}
              >
                <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className={`px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm ${saved ? "bg-[#25A05F]/10 text-[#25A05F]" : "bg-[#25A05F] hover:bg-[#1e8a4f] text-white"}`}
              style={{ fontWeight: 600 }}
            >
              {saved ? (
                <>
                  <Save size={14} /> Saved!
                </>
              ) : (
                <>
                  <Edit3 size={14} /> Edit Profile
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle size={14} /> {errorMessage}
        </div>
      )}

      {passwordSuccess && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
          <Check size={14} /> {passwordSuccess}
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-[#155433] to-[#25A05F] relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-20 w-40 h-40 bg-white rounded-full blur-3xl" />
          </div>
        </div>
        <div className="px-6 pb-6 -mt-14 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="relative">
              <div
                className="w-28 h-28 rounded-2xl bg-[#25A05F] flex items-center justify-center text-white text-4xl border-4 border-white shadow-lg"
                style={{ fontWeight: 800 }}
              >
                {initials}
              </div>
              {editing && (
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#25A05F] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#1e8a4f] transition-colors">
                  <Camera size={14} />
                </button>
              )}
            </div>
            <div className="flex-1 pt-2">
              <h2
                className="text-[#0E3442] text-2xl"
                style={{ fontWeight: 700 }}
              >
                {profile?.fullName}
              </h2>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                <Briefcase size={14} /> Manager
                {profile?.restaurantName && ` at ${profile.restaurantName}`}
              </p>
              <p className="text-gray-400 text-xs mt-1 flex items-center gap-1.5">
                <Clock size={12} /> Joined {joinedDate}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span
                className="bg-[#25A05F]/10 text-[#25A05F] text-xs px-3 py-1.5 rounded-full"
                style={{ fontWeight: 600 }}
              >
                Manager
              </span>
              <span
                className="bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-full"
                style={{ fontWeight: 600 }}
              >
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile Details */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-[#0E3442] mb-5" style={{ fontWeight: 600 }}>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  className="text-gray-500 text-xs block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Full Name
                </label>
                {editing ? (
                  <div className="relative">
                    <User
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#0E3442] focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-[#0E3442] py-2.5">
                    <User size={14} className="text-gray-400" />{" "}
                    {profile?.fullName}
                  </div>
                )}
              </div>
              <div>
                <label
                  className="text-gray-500 text-xs block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Email Address
                </label>
                <div className="flex items-center gap-2 text-sm text-[#0E3442] py-2.5">
                  <Mail size={14} className="text-gray-400" /> {profile?.email}
                </div>
              </div>
              <div>
                <label
                  className="text-gray-500 text-xs block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Phone Number
                </label>
                {editing ? (
                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#0E3442] focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-[#0E3442] py-2.5">
                    <Phone size={14} className="text-gray-400" />{" "}
                    {profile?.phone || "Not set"}
                  </div>
                )}
              </div>
              <div>
                <label
                  className="text-gray-500 text-xs block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Role
                </label>
                <div className="flex items-center gap-2 text-sm text-[#0E3442] py-2.5">
                  <Briefcase size={14} className="text-gray-400" /> Manager
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-[#0E3442] mb-5" style={{ fontWeight: 600 }}>
              Restaurant Details
            </h3>
            <div className="space-y-5">
              <div>
                <label
                  className="text-gray-500 text-xs block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Restaurant Name
                </label>
                {editing ? (
                  <div className="relative">
                    <Building2
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#0E3442] focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-[#0E3442] py-2.5">
                    <Building2 size={14} className="text-gray-400" />{" "}
                    {profile?.restaurantName || "Not set"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-[#0E3442] mb-5" style={{ fontWeight: 600 }}>
              Security & Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Key size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p
                      className="text-[#0E3442] text-sm"
                      style={{ fontWeight: 600 }}
                    >
                      Change Password
                    </p>
                    <p className="text-gray-400 text-xs">
                      Update your account password
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="text-[#25A05F] text-sm hover:underline"
                  style={{ fontWeight: 600 }}
                >
                  {showPasswordForm ? "Cancel" : "Update"}
                </button>
              </div>

              {showPasswordForm && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  {passwordError && (
                    <div className="text-red-600 text-xs flex items-center gap-1">
                      <AlertTriangle size={12} /> {passwordError}
                    </div>
                  )}
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0E3442] focus:outline-none focus:border-[#25A05F]"
                  />
                  <input
                    type="password"
                    placeholder="New Password (8+ chars, 1 uppercase, 1 number)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0E3442] focus:outline-none focus:border-[#25A05F]"
                  />
                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-5 py-2 rounded-xl text-sm transition-colors disabled:opacity-60"
                    style={{ fontWeight: 600 }}
                  >
                    {changingPassword ? "Changing..." : "Change Password"}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Shield size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p
                      className="text-[#0E3442] text-sm"
                      style={{ fontWeight: 600 }}
                    >
                      Two-Factor Authentication
                    </p>
                    <p className="text-gray-400 text-xs">
                      Add extra security to your account
                    </p>
                  </div>
                </div>
                <button
                  className="text-[#25A05F] text-sm hover:underline"
                  style={{ fontWeight: 600 }}
                >
                  Enable
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Bell size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p
                      className="text-[#0E3442] text-sm"
                      style={{ fontWeight: 600 }}
                    >
                      Notification Preferences
                    </p>
                    <p className="text-gray-400 text-xs">
                      Email, SMS, and push notifications
                    </p>
                  </div>
                </div>
                <button
                  className="text-[#25A05F] text-sm hover:underline"
                  style={{ fontWeight: 600 }}
                >
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-[#0E3442] mb-4" style={{ fontWeight: 600 }}>
              Account Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Mail size={14} /> {profile?.email}
              </div>
              {profile?.phone && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Globe size={14} /> {profile.phone}
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-500">
                <Clock size={14} /> Joined {joinedDate}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-[#0E3442] mb-4" style={{ fontWeight: 600 }}>
              Subscription
            </h3>
            <div className="bg-gradient-to-br from-[#155433] to-[#25A05F] rounded-xl p-5 text-white">
              <p className="text-white/60 text-xs" style={{ fontWeight: 600 }}>
                CURRENT PLAN
              </p>
              <p className="text-2xl mt-1" style={{ fontWeight: 800 }}>
                Pro
              </p>
              <p className="text-white/60 text-sm mt-2">
                $49/month · Renews Apr 30, 2026
              </p>
              <button
                className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm transition-colors"
                style={{ fontWeight: 600 }}
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

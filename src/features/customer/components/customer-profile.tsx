"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  Mail,
  Phone,
  Save,
  Edit3,
  ShoppingBag,
  Gift,
  Clock,
  AlertTriangle,
  Check,
} from "lucide-react";
import {
  apiGetMe,
  apiListOrders,
  apiUpdateMe,
  type CustomerOrder,
  type UserProfile,
} from "@/features/customer/api";
import { CustomerNav } from "@/features/customer/components/customer-nav";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { getAuthUser } from "@/platform/auth/session.client";

type Tab = "profile" | "orders";

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatMoney(value: number, currency = "EGP") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function CustomerProfile() {
  const navigate = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!getAuthUser()) {
      navigate.push("/auth");
    }
  }, [navigate]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setErrorMessage("");

        const [me, myOrders] = await Promise.all([
          apiGetMe(),
          apiListOrders({
            limit: 20,
            sortBy: "createdAt",
            sortDirection: "desc",
          }),
        ]);

        if (!active) {
          return;
        }

        setProfile(me);
        setFullName(me.fullName || "");
        setPhone(me.phone || "");
        setOrders(myOrders.items);
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : "Failed to load profile",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const paidOrders = orders.filter((order) => order.paymentStatus === "paid");
    const totalSpent = paidOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0,
    );
    const totalMeals = orders.reduce((sum, order) => sum + order.quantity, 0);

    return {
      totalOrders,
      totalSpent,
      totalMeals,
    };
  }, [orders]);

  async function handleSaveProfile() {
    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const updated = await apiUpdateMe({
        fullName,
        phone: phone || undefined,
      });

      setProfile(updated);
      setEditing(false);
      setSuccessMessage("Profile updated successfully");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  }

  const logout = useLogout();

  function handleSignOut() {
    logout.mutate();
  }

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <p className="text-gray-500 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <div className="text-center">
          <p className="text-red-600 text-sm mb-3">
            {errorMessage || "Could not load profile"}
          </p>
          <button
            onClick={() => navigate.push("/auth")}
            className="text-[#25A05F] text-sm"
            style={{ fontWeight: 700 }}
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <CustomerNav active="profile" title="Your Profile" backHref="/customer" />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex justify-end mb-3">
            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-1.5"
              style={{ fontWeight: 600 }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
          <h2 className="text-[#0E3442] text-2xl" style={{ fontWeight: 700 }}>
            {profile.fullName}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{profile.email}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
              <ShoppingBag size={18} className="mx-auto mb-2 text-[#25A05F]" />
              <p
                className="text-[#0E3442] text-2xl"
                style={{ fontWeight: 700 }}
              >
                {stats.totalOrders}
              </p>
              <p className="text-gray-400 text-xs">Orders</p>
            </div>
            <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
              <Gift size={18} className="mx-auto mb-2 text-[#155433]" />
              <p
                className="text-[#0E3442] text-2xl"
                style={{ fontWeight: 700 }}
              >
                {formatMoney(stats.totalSpent)}
              </p>
              <p className="text-gray-400 text-xs">Total Spent</p>
            </div>
            <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
              <Clock size={18} className="mx-auto mb-2 text-[#25A05F]" />
              <p
                className="text-[#0E3442] text-2xl"
                style={{ fontWeight: 700 }}
              >
                {stats.totalMeals}
              </p>
              <p className="text-gray-400 text-xs">Meals Reserved</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-6 shadow-sm">
          {[
            { id: "profile" as Tab, label: "Profile" },
            { id: "orders" as Tab, label: "Orders" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-[#25A05F] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={{ fontWeight: 600 }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle size={14} /> {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
            <Check size={14} /> {successMessage}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[#0E3442]" style={{ fontWeight: 600 }}>
                Personal Information
              </h3>
              {editing ? (
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-[#25A05F] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 disabled:opacity-60"
                  style={{ fontWeight: 600 }}
                >
                  <Save size={12} /> {saving ? "Saving..." : "Save"}
                </button>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="text-[#25A05F] text-sm flex items-center gap-1"
                  style={{ fontWeight: 600 }}
                >
                  <Edit3 size={12} /> Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  className="text-gray-400 text-xs block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Full Name
                </label>
                {editing ? (
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0E3442] focus:outline-none focus:border-[#25A05F]"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-[#0E3442] py-1">
                    <User size={14} className="text-gray-400" />{" "}
                    {profile.fullName}
                  </div>
                )}
              </div>
              <div>
                <label
                  className="text-gray-400 text-xs block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Email
                </label>
                <div className="flex items-center gap-2 text-sm text-[#0E3442] py-1">
                  <Mail size={14} className="text-gray-400" /> {profile.email}
                </div>
              </div>
              <div>
                <label
                  className="text-gray-400 text-xs block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Phone
                </label>
                {editing ? (
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0E3442] focus:outline-none focus:border-[#25A05F]"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-[#0E3442] py-1">
                    <Phone size={14} className="text-gray-400" />{" "}
                    {profile.phone || "Not set"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 pb-3">
              <h3 className="text-[#0E3442]" style={{ fontWeight: 600 }}>
                Order History
              </h3>
            </div>
            {orders.length === 0 ? (
              <div className="px-5 pb-6 text-sm text-gray-500">
                No orders yet.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#F5F7FA]">
                    <th
                      className="text-left text-gray-500 px-5 py-3"
                      style={{ fontWeight: 600 }}
                    >
                      Order
                    </th>
                    <th
                      className="text-left text-gray-500 px-5 py-3"
                      style={{ fontWeight: 600 }}
                    >
                      Status
                    </th>
                    <th
                      className="text-right text-gray-500 px-5 py-3"
                      style={{ fontWeight: 600 }}
                    >
                      Qty
                    </th>
                    <th
                      className="text-right text-gray-500 px-5 py-3"
                      style={{ fontWeight: 600 }}
                    >
                      Total
                    </th>
                    <th
                      className="text-right text-gray-500 px-5 py-3"
                      style={{ fontWeight: 600 }}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-50 hover:bg-[#F5F7FA] transition-colors"
                    >
                      <td
                        className="px-5 py-3 text-[#0E3442]"
                        style={{ fontWeight: 600 }}
                      >
                        {order.orderNumber}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {order.status}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-600">
                        {order.quantity}
                      </td>
                      <td
                        className="px-5 py-3 text-right text-[#25A05F]"
                        style={{ fontWeight: 600 }}
                      >
                        {formatMoney(order.totalPrice, order.currency || "EGP")}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-400">
                        {formatDate(order.createdAt || order.pickupWindowStart)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

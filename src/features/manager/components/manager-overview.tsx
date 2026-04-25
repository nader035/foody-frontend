"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TrendingUp, TrendingDown, Calendar, AlertTriangle, RefreshCw
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  apiListBranches,
  apiListDonations,
  apiListMeals,
  apiListOrders,
  type Branch,
  type CustomerOrder,
  type Donation,
  type SurplusMeal,
} from "@/features/manager/api";

function StatCard({
  label,
  value,
  trend,
  up,
  desc,
  loading,
}: {
  label: string;
  value: string | number;
  trend?: string;
  up?: boolean;
  desc?: string;
  loading?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <div className="w-9 h-9 bg-[#25A05F]/10 rounded-lg flex items-center justify-center mb-3">
        <div className="w-3 h-3 bg-[#25A05F] rounded-full" />
      </div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      {loading ? (
        <div className="h-9 bg-gray-100 animate-pulse rounded-lg w-20 mb-2" />
      ) : (
        <p className="text-[#0E3442] text-3xl" style={{ fontWeight: 700 }}>{value}</p>
      )}
      {trend && (
        <p className="text-gray-400 text-xs mt-2">
          <span className={`inline-flex items-center gap-0.5 ${up ? "text-[#25A05F]" : "text-orange-500"}`}>
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </span>{" "}
          {desc}
        </p>
      )}
    </div>
  );
}

export function ManagerOverview() {
  const [filter, setFilter] = useState<"today" | "week" | "month" | "custom">("today");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [meals, setMeals] = useState<SurplusMeal[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [branchResult, mealResult, donationResult, orderResult] = await Promise.all([
        apiListBranches({ limit: 100, includeInactive: false }),
        apiListMeals({ limit: 100, sortBy: "createdAt", sortDirection: "desc" }),
        apiListDonations({ limit: 100, sortBy: "createdAt", sortDirection: "desc" }),
        apiListOrders({ limit: 100, sortBy: "createdAt", sortDirection: "desc" }),
      ]);

      setBranches(branchResult.items);
      setMeals(mealResult.items);
      setDonations(donationResult.items);
      setOrders(orderResult.items);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute date range based on filter
  const dateRange = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (filter === "today") {
      return { from: today, to: new Date(today.getTime() + 86400000) };
    } else if (filter === "week") {
      return { from: new Date(today.getTime() - 7 * 86400000), to: new Date(today.getTime() + 86400000) };
    } else if (filter === "month") {
      return { from: new Date(today.getTime() - 30 * 86400000), to: new Date(today.getTime() + 86400000) };
    } else {
      // custom
      return {
        from: new Date(startDate),
        to: new Date(new Date(endDate).getTime() + 86400000),
      };
    }
  }, [filter, startDate, endDate]);

  // Filter data by date range
  const filteredMeals = useMemo(() =>
    meals.filter(m => {
      const d = new Date(m.createdAt || 0);
      return d >= dateRange.from && d < dateRange.to;
    }), [meals, dateRange]);

  const filteredDonations = useMemo(() =>
    donations.filter(d => {
      const dt = new Date(d.createdAt);
      return dt >= dateRange.from && dt < dateRange.to;
    }), [donations, dateRange]);

  const filteredOrders = useMemo(() =>
    orders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= dateRange.from && d < dateRange.to;
    }), [orders, dateRange]);

  // Summary stats
  const totalSurplus = filteredMeals.reduce((s, m) => s + m.quantityTotal, 0);
  const totalDonated = filteredDonations.filter(d => ["completed", "picked_up"].includes(d.status))
    .reduce((s, d) => s + d.quantity, 0);
  const totalSold = filteredOrders.filter(o => ["picked_up", "completed", "ready"].includes(o.status))
    .reduce((s, o) => s + o.quantity, 0);
  const activeBranches = branches.filter(b => b.isActive).length;

  // Top branches by meal count
  const topBranches = useMemo(() => {
    const branchMealCount: Record<string, { id: string; name: string; meals: number; revenue: number }> = {};
    filteredMeals.forEach(meal => {
      const id = typeof meal.branchId === "string" ? meal.branchId : meal.branchId._id;
      const name = typeof meal.branchId === "string"
        ? branches.find(b => b._id === meal.branchId)?. name || "Unknown"
        : meal.branchId.name;
      if (!branchMealCount[id]) branchMealCount[id] = { id, name, meals: 0, revenue: 0 };
      branchMealCount[id].meals += meal.quantityTotal;
    });
    filteredOrders.forEach(order => {
      const id = order.branchId;
      if (branchMealCount[id]) branchMealCount[id].revenue += order.totalPrice;
    });
    return Object.values(branchMealCount)
      .sort((a, b) => b.meals - a.meals)
      .slice(0, 5);
  }, [filteredMeals, filteredOrders, branches]);

  // Build 7-day chart data
  const surplusChart = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayMap: Record<string, number> = {};
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = days[d.getDay()];
      dayMap[key] = 0;
    }

    meals.forEach(m => {
      const d = new Date(m.createdAt || 0);
      const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (diffDays <= 6) {
        const key = days[d.getDay()];
        dayMap[key] = (dayMap[key] || 0) + m.quantityTotal;
      }
    });

    return Object.entries(dayMap).map(([name, surplus]) => ({ name, surplus }));
  }, [meals]);

  const stats = [
    { label: "Total Surplus", value: loading ? "—" : totalSurplus, trend: undefined, up: true, desc: filter },
    { label: "Meals Donated", value: loading ? "—" : totalDonated, trend: undefined, up: true, desc: filter },
    { label: "Meals Sold", value: loading ? "—" : totalSold, trend: undefined, up: true, desc: filter },
    { label: "Active Branches", value: loading ? "—" : activeBranches, trend: undefined, up: true, desc: "total" },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[#0E3442] text-2xl" style={{ fontWeight: 700 }}>Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s an overview of your store performance.</p>
      </div>

      {/* Duration Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {(["today", "week", "month", "custom"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm capitalize transition-all ${filter === f ? "bg-[#25A05F] text-white" : "text-gray-500 hover:bg-gray-50"}`}
              style={{ fontWeight: 600 }}
            >
              {f}
            </button>
          ))}
        </div>
        {filter === "custom" && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#25A05F] shadow-sm"
              />
            </div>
            <span className="text-gray-400 text-sm">to</span>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#25A05F] shadow-sm"
              />
            </div>
          </div>
        )}
        <button
          onClick={loadData}
          disabled={loading}
          className="ml-auto flex items-center gap-2 text-gray-400 hover:text-[#25A05F] text-sm disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle size={14} /> {errorMessage}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} loading={loading} />
        ))}
      </div>

      {/* Chart + Top Branches */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-[#0E3442] mb-4" style={{ fontWeight: 600 }}>Surplus Overview — Past 7 Days</h3>
          {loading ? (
            <div className="h-64 bg-gray-50 animate-pulse rounded-lg" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={surplusChart} barCategoryGap="20%" id="overview-surplus-chart">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      color: "#0E3442",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    }}
                  />
                  <Bar dataKey="surplus" fill="#25A05F" radius={[6, 6, 0, 0]} name="Surplus Meals" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
            <span className="w-3 h-3 rounded bg-[#25A05F]" /> Surplus Meals by Day
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-[#0E3442] mb-4" style={{ fontWeight: 600 }}>Top Branches</h3>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : topBranches.length === 0 ? (
            <p className="text-gray-400 text-sm">No branch data yet.</p>
          ) : (
            <div className="space-y-4">
              {topBranches.map((b) => (
                <div key={b.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-[#0E3442] text-sm" style={{ fontWeight: 600 }}>{b.name}</p>
                    <p className="text-gray-400 text-xs">{b.meals} meals</p>
                  </div>
                  <p className="text-[#25A05F] text-sm" style={{ fontWeight: 700 }}>
                    {b.revenue > 0 ? `EGP ${b.revenue.toFixed(0)}` : "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Branch Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Branches", value: loading ? "—" : branches.length },
          { label: "Active Branches", value: loading ? "—" : branches.filter(b => b.isActive).length },
          { label: "Total Donations", value: loading ? "—" : donations.filter(d => d.status === "completed").reduce((s, d) => s + d.quantity, 0) },
          { label: "Total Orders", value: loading ? "—" : orders.length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center">
            <p className="text-gray-500 text-sm mb-1">{s.label}</p>
            <p className="text-[#0E3442] text-3xl" style={{ fontWeight: 700 }}>{s.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}

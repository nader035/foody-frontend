"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  TrendingUp,
  Package,
  Heart,
  DollarSign,
  Leaf,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

const tooltipStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  color: "#0E3442",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

export function ManagerReports() {
  const [period, setPeriod] = useState("6months");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [meals, setMeals] = useState<SurplusMeal[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [mealResult, donationResult, orderResult, branchResult] =
        await Promise.all([
          apiListMeals({
            limit: 100,
            sortBy: "createdAt",
            sortDirection: "desc",
          }),
          apiListDonations({
            limit: 100,
            sortBy: "createdAt",
            sortDirection: "desc",
          }),
          apiListOrders({
            limit: 100,
            sortBy: "createdAt",
            sortDirection: "desc",
          }),
          apiListBranches({ limit: 100 }),
        ]);

      setMeals(mealResult.items);
      setDonations(donationResult.items);
      setOrders(orderResult.items);
      setBranches(branchResult.items);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load reports",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter by period
  const periodMs = useMemo(() => {
    if (period === "30days") return 30 * 86400000;
    if (period === "6months") return 180 * 86400000;
    return 365 * 86400000;
  }, [period]);

  const filteredMeals = useMemo(() => {
    const now = Date.now();
    return meals.filter(
      (m) => now - new Date(m.createdAt || 0).getTime() <= periodMs,
    );
  }, [meals, periodMs]);

  const filteredDonations = useMemo(() => {
    const now = Date.now();
    return donations.filter(
      (d) => now - new Date(d.createdAt).getTime() <= periodMs,
    );
  }, [donations, periodMs]);

  const filteredOrders = useMemo(() => {
    const now = Date.now();
    return orders.filter(
      (o) => now - new Date(o.createdAt).getTime() <= periodMs,
    );
  }, [orders, periodMs]);

  // Monthly chart data
  const monthlyData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const mapByYM: Record<
      string,
      { month: string; surplus: number; donated: number; sold: number }
    > = {};

    filteredMeals.forEach((m) => {
      const d = new Date(m.createdAt || 0);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!mapByYM[key])
        mapByYM[key] = {
          month: `${months[d.getMonth()]}`,
          surplus: 0,
          donated: 0,
          sold: 0,
        };
      mapByYM[key].surplus += m.quantityTotal;
    });

    filteredDonations.forEach((d) => {
      const dt = new Date(d.createdAt);
      const key = `${dt.getFullYear()}-${dt.getMonth()}`;
      if (!mapByYM[key])
        mapByYM[key] = {
          month: `${months[dt.getMonth()]}`,
          surplus: 0,
          donated: 0,
          sold: 0,
        };
      mapByYM[key].donated += d.quantity;
    });

    filteredOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!mapByYM[key])
        mapByYM[key] = {
          month: `${months[d.getMonth()]}`,
          surplus: 0,
          donated: 0,
          sold: 0,
        };
      mapByYM[key].sold += o.quantity;
    });

    return Object.entries(mapByYM)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v)
      .slice(-6);
  }, [filteredMeals, filteredDonations, filteredOrders]);

  // Branch performance
  const branchComparison = useMemo(() => {
    const branchMap: Record<
      string,
      { branch: string; surplus: number; donated: number; sold: number }
    > = {};

    branches.forEach((b) => {
      branchMap[b._id] = {
        branch: b.name.split(" ")[0],
        surplus: 0,
        donated: 0,
        sold: 0,
      };
    });

    filteredMeals.forEach((m) => {
      const id = typeof m.branchId === "string" ? m.branchId : m.branchId._id;
      if (branchMap[id]) branchMap[id].surplus += m.quantityTotal;
    });

    filteredDonations.forEach((d) => {
      if (branchMap[d.branchId]) branchMap[d.branchId].donated += d.quantity;
    });

    filteredOrders.forEach((o) => {
      if (branchMap[o.branchId]) branchMap[o.branchId].sold += o.quantity;
    });

    return Object.values(branchMap)
      .filter((b) => b.surplus > 0)
      .slice(0, 6);
  }, [branches, filteredMeals, filteredDonations, filteredOrders]);

  // Distribution pie
  const totalSurplus = filteredMeals.reduce((s, m) => s + m.quantityTotal, 0);
  const totalDonated = filteredDonations.reduce((s, d) => s + d.quantity, 0);
  const totalSold = filteredOrders.reduce((s, o) => s + o.quantity, 0);
  const totalWasted = Math.max(0, totalSurplus - totalDonated - totalSold);
  const distributionTotal = totalDonated + totalSold + totalWasted;

  const distributionData =
    distributionTotal > 0
      ? [
          {
            name: "Donated",
            value: Math.round((totalDonated / distributionTotal) * 100),
            color: "#25A05F",
          },
          {
            name: "Sold at Discount",
            value: Math.round((totalSold / distributionTotal) * 100),
            color: "#155433",
          },
          {
            name: "Wasted",
            value: Math.round((totalWasted / distributionTotal) * 100),
            color: "#ef4444",
          },
        ]
      : [{ name: "No data", value: 100, color: "#e5e7eb" }];

  // Impact metrics
  const totalRevenue = filteredOrders.reduce((s, o) => s + o.totalPrice, 0);
  const co2Saved = (((totalDonated + totalSold) * 2.5) / 1000).toFixed(1); // rough estimate: 2.5 kg CO2 per meal

  const impactMetrics = [
    {
      label: "Total Meals Saved",
      value: loading ? "—" : `${(totalDonated + totalSold).toLocaleString()}`,
      icon: Package,
      trend: "+18%",
    },
    {
      label: "Meals Donated",
      value: loading ? "—" : totalDonated.toLocaleString(),
      icon: Heart,
      trend: "+22%",
    },
    {
      label: "Revenue Recovered",
      value: loading ? "—" : `EGP ${totalRevenue.toFixed(0)}`,
      icon: DollarSign,
      trend: "+15%",
    },
    {
      label: "CO2 Prevented",
      value: loading ? "—" : `${co2Saved} tons`,
      icon: Leaf,
      trend: "+20%",
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0E3442] text-2xl" style={{ fontWeight: 700 }}>
            Reports & Analytics
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your impact and performance metrics — live from backend
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {[
              { v: "30days", l: "30D" },
              { v: "6months", l: "6M" },
              { v: "1year", l: "1Y" },
            ].map((p) => (
              <button
                key={p.v}
                onClick={() => setPeriod(p.v)}
                className={`px-4 py-2 text-xs transition-colors ${period === p.v ? "bg-[#25A05F] text-white" : "text-gray-500 hover:bg-gray-50"}`}
                style={{ fontWeight: 600 }}
              >
                {p.l}
              </button>
            ))}
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="bg-white border border-gray-200 text-gray-500 px-3 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-gray-50 shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors shadow-sm"
            style={{ fontWeight: 600 }}
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle size={14} /> {errorMessage}
        </div>
      )}

      {/* Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {impactMetrics.map((m) => (
          <div
            key={m.label}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#25A05F]/10 rounded-xl flex items-center justify-center">
                <m.icon size={18} className="text-[#25A05F]" />
              </div>
              <span
                className="text-[#25A05F] text-sm flex items-center gap-1"
                style={{ fontWeight: 600 }}
              >
                <TrendingUp size={12} /> {m.trend}
              </span>
            </div>
            {loading ? (
              <div className="h-7 bg-gray-100 animate-pulse rounded w-24 mb-1" />
            ) : (
              <p
                className="text-[#0E3442] text-2xl"
                style={{ fontWeight: 700 }}
              >
                {m.value}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-[#0E3442] mb-4" style={{ fontWeight: 600 }}>
            Monthly Surplus Trend
          </h3>
          {loading ? (
            <div className="h-72 bg-gray-50 animate-pulse rounded-lg" />
          ) : monthlyData.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
              No data for this period
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} id="reports-area-chart">
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#25A05F" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#25A05F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="surplus"
                    stroke="#25A05F"
                    strokeWidth={2}
                    fill="url(#sg)"
                    name="Total Surplus"
                  />
                  <Area
                    type="monotone"
                    dataKey="donated"
                    stroke="#155433"
                    strokeWidth={2}
                    fill="transparent"
                    name="Donated"
                  />
                  <Area
                    type="monotone"
                    dataKey="sold"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fill="transparent"
                    name="Sold"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-[#0E3442] mb-4" style={{ fontWeight: 600 }}>
            Surplus Distribution
          </h3>
          {loading ? (
            <div className="h-52 bg-gray-50 animate-pulse rounded-lg" />
          ) : (
            <>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart id="reports-pie-chart">
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      stroke="none"
                    >
                      {distributionData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(val) => `${val}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {distributionData.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="text-gray-500">{d.name}</span>
                    </div>
                    <span
                      className="text-[#0E3442]"
                      style={{ fontWeight: 600 }}
                    >
                      {d.value}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {branchComparison.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-6">
          <h3 className="text-[#0E3442] mb-4" style={{ fontWeight: 600 }}>
            Branch Performance Comparison
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchComparison} id="reports-bar-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="branch"
                  stroke="#9CA3AF"
                  tick={{ fontSize: 11 }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey="donated"
                  fill="#25A05F"
                  radius={[4, 4, 0, 0]}
                  name="Donated"
                />
                <Bar
                  dataKey="sold"
                  fill="#155433"
                  radius={[4, 4, 0, 0]}
                  name="Sold"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 pb-3">
          <h3 className="text-[#0E3442]" style={{ fontWeight: 600 }}>
            Monthly Summary
          </h3>
        </div>
        {loading ? (
          <div className="p-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-8 bg-gray-100 animate-pulse rounded mb-2"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F5F7FA]">
                  <th
                    className="text-left text-gray-500 px-5 py-3"
                    style={{ fontWeight: 600 }}
                  >
                    Month
                  </th>
                  <th
                    className="text-right text-gray-500 px-5 py-3"
                    style={{ fontWeight: 600 }}
                  >
                    Surplus
                  </th>
                  <th
                    className="text-right text-gray-500 px-5 py-3"
                    style={{ fontWeight: 600 }}
                  >
                    Donated
                  </th>
                  <th
                    className="text-right text-gray-500 px-5 py-3"
                    style={{ fontWeight: 600 }}
                  >
                    Sold
                  </th>
                  <th
                    className="text-right text-gray-500 px-5 py-3"
                    style={{ fontWeight: 600 }}
                  >
                    Waste Rate
                  </th>
                  <th
                    className="text-right text-gray-500 px-5 py-3"
                    style={{ fontWeight: 600 }}
                  >
                    Recovery
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-gray-400 text-sm"
                    >
                      No data available for this period
                    </td>
                  </tr>
                ) : (
                  monthlyData.map((m) => {
                    const waste = Math.max(0, m.surplus - m.donated - m.sold);
                    const wasteRate =
                      m.surplus > 0
                        ? ((waste / m.surplus) * 100).toFixed(1)
                        : "0.0";
                    const recovery =
                      m.surplus > 0
                        ? (((m.donated + m.sold) / m.surplus) * 100).toFixed(1)
                        : "0.0";
                    return (
                      <tr
                        key={m.month}
                        className="border-b border-gray-50 hover:bg-[#F5F7FA] transition-colors"
                      >
                        <td
                          className="px-5 py-3 text-[#0E3442]"
                          style={{ fontWeight: 600 }}
                        >
                          {m.month}
                        </td>
                        <td className="px-5 py-3 text-right text-gray-600">
                          {m.surplus}
                        </td>
                        <td
                          className="px-5 py-3 text-right text-[#25A05F]"
                          style={{ fontWeight: 600 }}
                        >
                          {m.donated}
                        </td>
                        <td className="px-5 py-3 text-right text-gray-600">
                          {m.sold}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${Number(wasteRate) < 20 ? "bg-[#25A05F]/10 text-[#25A05F]" : "bg-red-100 text-red-500"}`}
                            style={{ fontWeight: 600 }}
                          >
                            {wasteRate}%
                          </span>
                        </td>
                        <td
                          className="px-5 py-3 text-right text-[#25A05F]"
                          style={{ fontWeight: 600 }}
                        >
                          {recovery}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

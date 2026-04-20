"use client";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import {
  LayoutDashboard,
  GitBranch,
  Heart,
  BarChart3,
  Settings,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: GitBranch, label: "Branches" },
  { icon: Heart, label: "Charities" },
  { icon: BarChart3, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

const stats = [
  { label: "Total Surplus Today", value: "142", trend: "+12%", up: true },
  { label: "Meals Donated", value: "48", trend: "+8%", up: true },
  { label: "Meals Sold at Discount", value: "67", trend: "-3%", up: false },
  { label: "Active Branches", value: "12", trend: "+2", up: true },
];

const chartData = [
  { day: "Mon", surplus: 120, donated: 40 },
  { day: "Tue", surplus: 98, donated: 35 },
  { day: "Wed", surplus: 145, donated: 52 },
  { day: "Thu", surplus: 110, donated: 38 },
  { day: "Fri", surplus: 160, donated: 58 },
  { day: "Sat", surplus: 175, donated: 65 },
  { day: "Sun", surplus: 142, donated: 48 },
];

const branches = [
  {
    name: "Downtown Main",
    surplus: 28,
    donated: 10,
    sold: 14,
    status: "Active",
  },
  { name: "Airport Road", surplus: 22, donated: 8, sold: 11, status: "Active" },
  {
    name: "Mall Central",
    surplus: 35,
    donated: 12,
    sold: 18,
    status: "Active",
  },
  {
    name: "University Ave",
    surplus: 18,
    donated: 6,
    sold: 9,
    status: "Low Stock",
  },
  { name: "Harbor View", surplus: 15, donated: 5, sold: 7, status: "Active" },
  {
    name: "Westside Plaza",
    surplus: 24,
    donated: 7,
    sold: 8,
    status: "Inactive",
  },
];

export function ManagerDashboard() {
  const [donationPct, setDonationPct] = useState(30);
  const [discountPct, setDiscountPct] = useState(50);

  return (
    <div className="flex h-screen" style={{ fontFamily: "Nunito, sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-64 bg-[#155433] flex flex-col shrink-0">
        <div className="p-6 pb-8">
          <Logo size="md" style={{ filter: "brightness(0) invert(1)" }} />
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                item.active
                  ? "bg-[#25A05F] text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 text-white/40 text-xs">
          Foody v1.0 — Manager Portal
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#0E3442] overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white" style={{ fontWeight: 700 }}>
              Dashboard Overview
            </h1>
            <p className="text-white/50 text-sm mt-1">Monday, April 13, 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-[#25A05F] flex items-center justify-center text-white"
              style={{ fontWeight: 700 }}
            >
              MG
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-[#155433]/60 backdrop-blur rounded-xl p-5 border border-white/5"
            >
              <p className="text-white/50 text-sm mb-2">{s.label}</p>
              <div className="flex items-end justify-between">
                <span
                  className="text-3xl text-white"
                  style={{ fontWeight: 700 }}
                >
                  {s.value}
                </span>
                <span
                  className={`flex items-center gap-1 text-sm ${s.up ? "text-[#25A05F]" : "text-red-400"}`}
                >
                  {s.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {s.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Chart + Table */}
          <div className="xl:col-span-2 space-y-6">
            {/* Chart */}
            <div className="bg-[#155433]/40 rounded-xl p-5 border border-white/5">
              <h3 className="text-white mb-4" style={{ fontWeight: 600 }}>
                Daily Surplus — Past 7 Days
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="surplusGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#25A05F"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#25A05F"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="donatedGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#ffffff"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="100%"
                          stopColor="#ffffff"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.07)"
                    />
                    <XAxis
                      dataKey="day"
                      stroke="rgba(255,255,255,0.4)"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.4)"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#155433",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="surplus"
                      stroke="#25A05F"
                      strokeWidth={2}
                      fill="url(#surplusGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="donated"
                      stroke="#ffffff"
                      strokeWidth={2}
                      fill="url(#donatedGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-6 mt-3">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <span className="w-3 h-3 rounded-full bg-[#25A05F]" /> Total
                  Surplus
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <span className="w-3 h-3 rounded-full bg-white" /> Donated
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#155433]/40 rounded-xl border border-white/5 overflow-hidden">
              <div className="p-5 pb-3">
                <h3 className="text-white" style={{ fontWeight: 600 }}>
                  All Branches
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/40 px-5 py-3">
                        Branch Name
                      </th>
                      <th className="text-right text-white/40 px-5 py-3">
                        Surplus
                      </th>
                      <th className="text-right text-white/40 px-5 py-3">
                        Donated
                      </th>
                      <th className="text-right text-white/40 px-5 py-3">
                        Sold
                      </th>
                      <th className="text-right text-white/40 px-5 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map((b) => (
                      <tr
                        key={b.name}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-5 py-3 text-white">{b.name}</td>
                        <td className="px-5 py-3 text-right text-white/80">
                          {b.surplus}
                        </td>
                        <td className="px-5 py-3 text-right text-[#25A05F]">
                          {b.donated}
                        </td>
                        <td className="px-5 py-3 text-right text-white/80">
                          {b.sold}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${
                              b.status === "Active"
                                ? "bg-[#25A05F]/20 text-[#25A05F]"
                                : b.status === "Low Stock"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-white/10 text-white/40"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <div className="bg-[#155433]/60 rounded-xl p-5 border border-white/5">
              <h3 className="text-white mb-5" style={{ fontWeight: 600 }}>
                <Settings size={16} className="inline mr-2 mb-0.5" />
                Distribution Settings
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/60 text-sm">Donation %</span>
                    <span
                      className="text-[#25A05F] text-sm"
                      style={{ fontWeight: 700 }}
                    >
                      {donationPct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={donationPct}
                    onChange={(e) => setDonationPct(Number(e.target.value))}
                    className="w-full accent-[#25A05F] h-2 rounded-full appearance-none bg-white/10"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/60 text-sm">Discount %</span>
                    <span
                      className="text-[#25A05F] text-sm"
                      style={{ fontWeight: 700 }}
                    >
                      {discountPct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={discountPct}
                    onChange={(e) => setDiscountPct(Number(e.target.value))}
                    className="w-full accent-[#25A05F] h-2 rounded-full appearance-none bg-white/10"
                  />
                </div>
              </div>
              <div className="mt-6 p-4 bg-[#0E3442] rounded-lg">
                <p className="text-white/50 text-xs mb-1">
                  Preview for 20 meals:
                </p>
                <p className="text-white text-sm">
                  <span className="text-[#25A05F]" style={{ fontWeight: 700 }}>
                    {Math.round((20 * donationPct) / 100)}
                  </span>{" "}
                  donated ·{" "}
                  <span className="text-white" style={{ fontWeight: 700 }}>
                    {20 - Math.round((20 * donationPct) / 100)}
                  </span>{" "}
                  discounted at {discountPct}% off
                </p>
              </div>
            </div>

            <div className="bg-[#155433]/60 rounded-xl p-5 border border-white/5">
              <h3 className="text-white mb-3" style={{ fontWeight: 600 }}>
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full bg-[#25A05F] hover:bg-[#1e8a4f] text-white py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <ArrowUpRight size={16} /> Export Report
                </button>
                <button className="w-full bg-white/10 hover:bg-white/15 text-white py-2.5 rounded-lg transition-colors">
                  Notify Charities
                </button>
                <button className="w-full bg-white/10 hover:bg-white/15 text-white py-2.5 rounded-lg transition-colors">
                  Add Branch
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Heart,
  ShoppingBag,
  TrendingUp,
  Check,
} from "lucide-react";

const features = [
  {
    id: "track",
    label: "Surplus Tracking",
    icon: BarChart3,
    title: "Real-time surplus tracking across all branches",
    desc: "Monitor food surplus as it happens. Our intelligent dashboard gives managers complete visibility into every branch, meal type, and time window — so nothing goes to waste unnoticed.",
    bullets: [
      "Live branch-by-branch surplus feed",
      "Automatic categorization by meal type",
      "Expiry countdown alerts",
    ],
  },
  {
    id: "donate",
    label: "Smart Donations",
    icon: Heart,
    title: "Automated donation matching with local charities",
    desc: "Foody automatically routes surplus meals to nearby charities based on quantity, pickup windows, and location. Charities get instant notifications — no manual coordination needed.",
    bullets: [
      "Auto-match with nearest charity",
      "One-tap pickup confirmation",
      "Full donation history & receipts",
    ],
  },
  {
    id: "discount",
    label: "Discount Sales",
    icon: ShoppingBag,
    title: "Sell remaining surplus at smart discounts",
    desc: "What's not donated gets listed on the Foody marketplace at up to 50% off. Customers love the value, and restaurants recover costs instead of throwing food away.",
    bullets: [
      "Dynamic pricing based on expiry window",
      "Customer-facing marketplace",
      "Countdown timers drive urgency",
    ],
  },
  {
    id: "report",
    label: "Impact Reports",
    icon: TrendingUp,
    title: "Measure your environmental and social impact",
    desc: "Generate beautiful reports showing meals donated, CO₂ saved, revenue recovered, and community impact. Perfect for CSR reporting and stakeholder presentations.",
    bullets: [
      "Automated weekly/monthly reports",
      "CO₂ and waste reduction metrics",
      "Export to PDF or share online",
    ],
  },
];

export function LandingFeatures() {
  const navigate = useRouter();
  const [activeFeature, setActiveFeature] = useState("track");
  const feat = features.find((f) => f.id === activeFeature)!;

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-[#0E3442] mb-3" style={{ fontSize: "2.25rem", fontWeight: 800 }}>
            Built for impact,
            <br />
            crafted for simplicity
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Empowering restaurants with powerful, scalable surplus management
            that delivers real results at every level.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {features.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFeature(f.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all ${
                activeFeature === f.id
                  ? "bg-[#25A05F] text-white shadow-lg shadow-[#25A05F]/20"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              style={{ fontWeight: 600 }}
            >
              <f.icon size={16} /> {f.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={feat.id + "-text"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-[#25A05F] text-xs mb-2" style={{ fontWeight: 700 }}>
                {feat.label.toUpperCase()}
              </p>
              <h3 className="text-[#0E3442] mb-4" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
                {feat.title}
              </h3>
              <p className="text-gray-500 mb-6" style={{ lineHeight: 1.8 }}>
                {feat.desc}
              </p>
              <ul className="space-y-3 mb-6">
                {feat.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="w-5 h-5 bg-[#25A05F]/10 rounded-full flex items-center justify-center shrink-0">
                      <Check size={12} className="text-[#25A05F]" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate.push("/manager")}
                className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
                style={{ fontWeight: 600 }}
              >
                Try it now <ArrowRight size={16} />
              </button>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={feat.id + "-visual"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 rounded-2xl border border-gray-100 p-8 flex items-center justify-center min-h-[320px] h-full w-full"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full max-w-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#25A05F]/10 rounded-xl flex items-center justify-center">
                    <feat.icon size={20} className="text-[#25A05F]" />
                  </div>
                  <div>
                    <p className="text-[#0E3442] text-sm" style={{ fontWeight: 700 }}>
                      {feat.label}
                    </p>
                    <p className="text-gray-400 text-xs">Live preview</p>
                  </div>
                </div>
                {activeFeature === "track" && (
                  <div className="space-y-2">
                    {["Downtown Main — 28 meals", "Mall Central — 35 meals", "Airport Road — 22 meals"].map((t) => (
                      <div key={t} className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-600">{t}</span>
                        <span className="w-2 h-2 rounded-full bg-[#25A05F]" />
                      </div>
                    ))}
                  </div>
                )}
                {activeFeature === "donate" && (
                  <div className="space-y-2">
                    <div className="bg-[#25A05F]/10 rounded-lg p-3 text-sm text-[#155433]">
                      <p style={{ fontWeight: 600 }}>New match found!</p>
                      <p className="text-xs text-gray-500 mt-1">6 meals — City Food Bank — 1.2 km away</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">
                      <p>8 meals — Community Kitchen — 2.5 km</p>
                    </div>
                  </div>
                )}
                {activeFeature === "discount" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-[#25A05F]/20 rounded-lg" />
                      <div className="flex-1">
                        <p className="text-sm text-[#0E3442]" style={{ fontWeight: 600 }}>Grilled Chicken</p>
                        <p className="text-xs"><span className="text-gray-400 line-through">$12.99</span> <span className="text-[#25A05F]" style={{ fontWeight: 700 }}>$6.49</span></p>
                      </div>
                      <span className="text-[10px] bg-[#25A05F]/10 text-[#25A05F] px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>50% OFF</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-[#155433]/20 rounded-lg" />
                      <div className="flex-1">
                        <p className="text-sm text-[#0E3442]" style={{ fontWeight: 600 }}>Pasta Alfredo</p>
                        <p className="text-xs"><span className="text-gray-400 line-through">$14.50</span> <span className="text-[#25A05F]" style={{ fontWeight: 700 }}>$7.25</span></p>
                      </div>
                      <span className="text-[10px] bg-[#25A05F]/10 text-[#25A05F] px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>50% OFF</span>
                    </div>
                  </div>
                )}
                {activeFeature === "report" && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Meals saved</span><span className="text-[#155433]" style={{ fontWeight: 700 }}>1,247</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">CO₂ prevented</span><span className="text-[#155433]" style={{ fontWeight: 700 }}>3.2 tons</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Revenue recovered</span><span className="text-[#25A05F]" style={{ fontWeight: 700 }}>$8,420</span></div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-2"><div className="bg-[#25A05F] h-2 rounded-full" style={{ width: "82%" }} /></div>
                    <p className="text-[10px] text-gray-400">82% waste reduction target achieved</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

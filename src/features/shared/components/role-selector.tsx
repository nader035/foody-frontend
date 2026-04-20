"use client";
import {
  LayoutDashboard,
  ClipboardList,
  Heart,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";

const roles = [
  {
    path: "/manager",
    label: "Restaurant Manager",
    desc: "Manage branches, view analytics, configure settings",
    icon: LayoutDashboard,
    color: "#155433",
  },
  {
    path: "/staff",
    label: "Branch Staff",
    desc: "Log surplus meals quickly from the kitchen",
    icon: ClipboardList,
    color: "#25A05F",
  },
  {
    path: "/charity",
    label: "Charity Organization",
    desc: "View & confirm available food donations",
    icon: Heart,
    color: "#0E3442",
  },
  {
    path: "/customer",
    label: "Individual Customer",
    desc: "Browse discounted surplus meals nearby",
    icon: ShoppingBag,
    color: "#25A05F",
  },
];

export function RoleSelector() {
  const navigate = useRouter();
  return (
    <div
      className="min-h-screen bg-[#155433] flex items-center justify-center p-6"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="text-center max-w-2xl w-full">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        <p className="text-white/50 text-sm mb-10">
          Restaurant Food Surplus Management Platform
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roles.map((r) => (
            <button
              key={r.path}
              onClick={() => navigate.push(r.path)}
              className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-6 text-left transition-all hover:scale-[1.02] group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#25A05F]/20 flex items-center justify-center mb-4 group-hover:bg-[#25A05F]/30 transition-colors">
                <r.icon size={24} className="text-[#25A05F]" />
              </div>
              <h3 className="text-white mb-1" style={{ fontWeight: 700 }}>
                {r.label}
              </h3>
              <p className="text-white/40 text-sm">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

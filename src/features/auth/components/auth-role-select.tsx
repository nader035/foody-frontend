"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/shared/branding";
import {
  LayoutDashboard,
  ClipboardList,
  Heart,
  ShoppingBag,
  ArrowRight,
  Leaf,
  Check,
} from "lucide-react";

const roles = [
  {
    id: "customer",
    label: "Customer",
    desc: "Browse and reserve discounted surplus meals from nearby restaurants",
    icon: ShoppingBag,
    color: "#25A05F",
    canSignup: true,
  },
  {
    id: "manager",
    label: "Restaurant Manager",
    desc: "Manage surplus across branches, set policies, and view analytics",
    icon: LayoutDashboard,
    color: "#155433",
    canSignup: true,
  },
  {
    id: "staff",
    label: "Branch Staff",
    desc: "Log surplus meals quickly and manage daily branch operations",
    icon: ClipboardList,
    color: "#0E3442",
    canSignup: false,
  },
  {
    id: "charity",
    label: "Charity Organization",
    desc: "Receive donation alerts and manage pickups from partner restaurants",
    icon: Heart,
    color: "#25A05F",
    canSignup: true,
  },
];

export function AuthRoleSelect() {
  const navigate = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#155433] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-20 w-80 h-80 bg-[#25A05F] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-[#25A05F] rounded-full blur-3xl" />
        </div>
        <div
          className="relative z-10 cursor-pointer"
          onClick={() => navigate.push("/")}
        >
          <Logo size="lg" />
        </div>
        <div className="relative z-10 space-y-6">
          <div
            className="inline-flex items-center gap-2 bg-[#25A05F]/20 text-[#25A05F] text-xs px-3 py-1.5 rounded-full"
            style={{ fontWeight: 600 }}
          >
            <Leaf size={14} /> Four portals, one mission
          </div>
          <h2
            className="text-white text-4xl leading-tight"
            style={{ fontWeight: 700 }}
          >
            Choose your role
            <br />
            to get started
          </h2>
          <p className="text-white/60 text-lg max-w-md">
            Each role has a purpose-built experience. Select how you&apos;ll use
            Foody, then log in or create your account.
          </p>
          <div className="space-y-3 pt-2">
            {[
              "Personalized dashboard per role",
              "Tailored features & permissions",
              "Seamless onboarding experience",
            ].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-[#25A05F] rounded-full flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white" />
                </div>
                <span className="text-white/70 text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-white/30 text-sm">
          &copy; 2026 Foody. All rights reserved.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-lg">
          <div
            className="lg:hidden mb-8 cursor-pointer"
            onClick={() => navigate.push("/")}
          >
            <Logo size="md" />
          </div>

          <h1
            className="text-[#0E3442] text-3xl mb-2"
            style={{ fontWeight: 700 }}
          >
            How will you use Foody?
          </h1>
          <p className="text-gray-500 mb-8">
            Select your role to continue to login or signup
          </p>

          {/* Role Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {roles.map((r) => {
              const isSelected = selected === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelected(r.id)}
                  className={`relative text-left p-5 rounded-2xl border-2 transition-all group ${
                    isSelected
                      ? "border-[#25A05F] bg-[#25A05F]/5 shadow-md shadow-[#25A05F]/10"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {/* Check indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-[#25A05F] rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      isSelected
                        ? "bg-[#25A05F]"
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }`}
                  >
                    <r.icon
                      size={20}
                      className={isSelected ? "text-white" : "text-gray-500"}
                    />
                  </div>
                  <h3
                    className={`text-sm mb-1 ${isSelected ? "text-[#25A05F]" : "text-[#0E3442]"}`}
                    style={{ fontWeight: 700 }}
                  >
                    {r.label}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {r.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {selected === "staff" && (
              <div className="bg-[#0E3442]/5 border border-[#0E3442]/10 rounded-xl p-4 flex items-start gap-3">
                <ClipboardList
                  size={18}
                  className="text-[#0E3442] shrink-0 mt-0.5"
                />
                <div>
                  <p
                    className="text-[#0E3442] text-sm"
                    style={{ fontWeight: 700 }}
                  >
                    Staff accounts are created by managers
                  </p>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                    Your restaurant manager will create your account and send
                    you login credentials. If you already have credentials, use
                    the login button below.
                  </p>
                </div>
              </div>
            )}
            {selected !== "staff" && (
              <button
                disabled={!selected}
                onClick={() => navigate.push(`/signup?role=${selected}`)}
                className="w-full bg-[#25A05F] hover:bg-[#1e8a4f] disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                style={{ fontWeight: 600 }}
              >
                Create Account <ArrowRight size={16} />
              </button>
            )}
            <button
              disabled={!selected}
              onClick={() => navigate.push(`/login?role=${selected}`)}
              className={`w-full ${selected === "staff" ? "bg-[#25A05F] hover:bg-[#1e8a4f] text-white" : "bg-white hover:bg-gray-50 border border-gray-200 text-[#0E3442]"} disabled:opacity-40 disabled:cursor-not-allowed py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all`}
              style={{ fontWeight: 600 }}
            >
              {selected === "staff" ? (
                <>
                  Sign In to Your Account <ArrowRight size={16} />
                </>
              ) : (
                "I already have an account"
              )}
            </button>
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            {selected === "staff"
              ? "Contact your restaurant manager if you don't have login credentials"
              : "You can always switch roles later from your account settings"}
          </p>
        </div>
      </div>
    </div>
  );
}

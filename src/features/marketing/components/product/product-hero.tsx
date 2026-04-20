"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Zap } from "lucide-react";

export function ProductHero() {
  const navigate = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-center">
      <div
        className="inline-flex items-center gap-2 bg-[#25A05F]/10 text-[#25A05F] text-xs px-3 py-1.5 rounded-full mb-6"
        style={{ fontWeight: 600 }}
      >
        <Zap size={14} /> All-in-one food surplus management
      </div>
      <h1
        className="text-[#0E3442] mb-5 max-w-3xl mx-auto"
        style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1.1 }}
      >
        One platform to manage, donate, and sell surplus food
      </h1>
      <p
        className="text-gray-500 max-w-2xl mx-auto mb-8"
        style={{ lineHeight: 1.7 }}
      >
        Foody is an innovative centralized web platform connecting restaurant
        management, branch staff, charities, and individual customers in one
        integrated system — ensuring efficient surplus management with complete
        ease.
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => navigate.push("/auth")}
          className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-7 py-3.5 rounded-xl flex items-center gap-2 transition-colors"
          style={{ fontWeight: 700 }}
        >
          Start free trial <ArrowRight size={18} />
        </button>
        <button
          onClick={() => navigate.push("/customer")}
          className="border border-gray-200 text-[#0E3442] px-7 py-3.5 rounded-xl hover:border-[#25A05F] transition-colors"
          style={{ fontWeight: 600 }}
        >
          See it live
        </button>
      </div>
    </section>
  );
}

"use client";

import { useRouter } from "next/navigation";

export function SolutionsCta() {
  const navigate = useRouter();

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-[#155433] rounded-3xl p-12 text-center">
          <h2
            className="text-white mb-3"
            style={{ fontSize: "2rem", fontWeight: 800 }}
          >
            Find your solution
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Whether you&apos;re a restaurant, charity, or customer — Foody has a
            portal built for you.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => navigate.push("/manager")}
              className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-6 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{ fontWeight: 600 }}
            >
              Restaurant Manager
            </button>
            <button
              onClick={() => navigate.push("/customer")}
              className="border border-white/20 text-white px-6 py-3 rounded-xl text-sm hover:bg-white/10"
              style={{ fontWeight: 600 }}
            >
              Customer Marketplace
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

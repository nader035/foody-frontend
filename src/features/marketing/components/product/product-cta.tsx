"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function ProductCta() {
  const navigate = useRouter();

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-[#155433] rounded-3xl p-12 text-center">
          <h2
            className="text-white mb-3"
            style={{ fontSize: "2rem", fontWeight: 800 }}
          >
            Ready to get started?
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Join 320+ restaurants already transforming surplus food into impact.
          </p>
          <button
            onClick={() => navigate.push("/auth")}
            className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-8 py-3.5 rounded-xl flex items-center gap-2 mx-auto transition-colors"
            style={{ fontWeight: 700 }}
          >
            Start free trial <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

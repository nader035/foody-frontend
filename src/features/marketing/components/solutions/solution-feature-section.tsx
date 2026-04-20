"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Check, Heart, ShoppingBag, Utensils } from "lucide-react";

import type { SolutionItem } from "./solutions-data";

type SolutionFeatureSectionProps = {
  solution: SolutionItem;
  index: number;
};

export function SolutionFeatureSection({
  solution,
  index,
}: SolutionFeatureSectionProps) {
  const navigate = useRouter();
  const iconMap = {
    utensils: Utensils,
    heart: Heart,
    shoppingBag: ShoppingBag,
  } as const;
  const Icon = iconMap[solution.icon];

  return (
    <section className={index % 2 === 0 ? "bg-gray-50 py-20" : "py-20"}>
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? "lg:grid-flow-dense" : ""}`}
        >
          <div className={index % 2 !== 0 ? "lg:col-start-2" : ""}>
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
              style={{ backgroundColor: solution.color + "1A" }}
            >
              <Icon size={26} style={{ color: solution.color }} />
            </div>
            <h2
              className="text-[#0E3442] mb-2"
              style={{ fontSize: "2rem", fontWeight: 800 }}
            >
              {solution.title}
            </h2>
            <p
              className="text-[#25A05F] text-sm mb-4"
              style={{ fontWeight: 600 }}
            >
              {solution.subtitle}
            </p>
            <p className="text-gray-500 mb-6" style={{ lineHeight: 1.8 }}>
              {solution.desc}
            </p>
            <ul className="space-y-3 mb-6">
              {solution.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-sm text-gray-600"
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: solution.color + "1A" }}
                  >
                    <Check size={12} style={{ color: solution.color }} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate.push("/signup")}
              className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-colors"
              style={{ fontWeight: 600 }}
            >
              Get started <ArrowRight size={16} />
            </button>
          </div>
          <div
            className={`bg-white rounded-2xl border border-gray-100 p-8 shadow-sm ${index % 2 !== 0 ? "lg:col-start-1" : ""}`}
          >
            <div className="text-center mb-6">
              <p
                className="text-5xl mb-2"
                style={{ fontWeight: 800, color: solution.color }}
              >
                {solution.stat.v}
              </p>
              <p className="text-gray-500 text-sm">{solution.stat.l}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="space-y-3">
                {solution.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs"
                      style={{
                        backgroundColor: solution.color,
                        fontWeight: 700,
                      }}
                    >
                      {benefitIndex + 1}
                    </div>
                    <p className="text-gray-600 text-sm">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import { MarketingNavbar } from "@/features/marketing/components/shared/marketing-navbar";
import { SolutionsHero } from "./solutions-hero";
import { solutions } from "./solutions-data";
import { SolutionFeatureSection } from "./solution-feature-section";
import { SolutionsCta } from "./solutions-cta";
import { SolutionsFooter } from "./solutions-footer";

export function SolutionsPage() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <MarketingNavbar activeLink="Solutions" />
      <SolutionsHero />
      {solutions.map((solution, index) => (
        <SolutionFeatureSection
          key={solution.id}
          solution={solution}
          index={index}
        />
      ))}
      <SolutionsCta />
      <SolutionsFooter />
    </div>
  );
}

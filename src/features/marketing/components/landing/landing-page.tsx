import { MarketingNavbar } from "@/features/marketing/components/shared/marketing-navbar";
import { LandingHero } from "./landing-hero";
import { LandingStats } from "./landing-stats";
import { LandingFeatures } from "./landing-features";
import { LandingRoles } from "./landing-roles";
import { LandingCta } from "./landing-cta";
import { LandingFooter } from "./landing-footer";

export function LandingPage() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <MarketingNavbar />
      <LandingHero />
      <LandingStats />
      <LandingFeatures />
      <LandingRoles />
      <LandingCta />
      <LandingFooter />
    </div>
  );
}

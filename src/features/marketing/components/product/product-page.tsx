import { MarketingNavbar } from "@/features/marketing/components/shared/marketing-navbar";
import { ProductHero } from "./product-hero";
import { ProductFeatures } from "./product-features";
import { ProductRoles } from "./product-roles";
import { ProductComparison } from "./product-comparison";
import { ProductCta } from "./product-cta";
import { ProductFooter } from "./product-footer";

export function ProductPage() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <MarketingNavbar activeLink="Product" />
      <ProductHero />
      <ProductFeatures />
      <ProductRoles />
      <ProductComparison />
      <ProductCta />
      <ProductFooter />
    </div>
  );
}

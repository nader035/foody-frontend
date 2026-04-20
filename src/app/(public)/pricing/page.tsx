import type { Metadata } from "next";
import { PricingPage } from '@/features/marketing/components/pricing-page';

export const metadata: Metadata = {
  title: "Pricing",
};


export default function Page() {
  return <PricingPage />;
}

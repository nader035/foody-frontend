import type { Metadata } from "next";
import { PricingPage } from "@/features/marketing";

export const metadata: Metadata = {
  title: "Pricing",
};


export default function Page() {
  return <PricingPage />;
}

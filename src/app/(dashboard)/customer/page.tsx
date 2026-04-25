import type { Metadata } from "next";
import { CustomerListings } from "@/features/customer";

export const metadata: Metadata = {
  title: "Customer Marketplace",
};


export default function Page() {
  return <CustomerListings />;
}

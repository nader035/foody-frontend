import type { Metadata } from "next";
import { CustomerMealDetail } from "@/features/customer";

export const metadata: Metadata = {
  title: "Meal Details",
};

export default function Page() {
  return <CustomerMealDetail />;
}

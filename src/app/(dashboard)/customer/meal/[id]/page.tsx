import type { Metadata } from "next";
import { CustomerMealDetail } from "@/features/customer/components/customer-meal-detail";

export const metadata: Metadata = {
  title: "Meal Details",
};

export default function Page() {
  return <CustomerMealDetail />;
}

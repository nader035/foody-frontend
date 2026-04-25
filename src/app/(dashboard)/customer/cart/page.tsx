import type { Metadata } from "next";
import { CustomerCart } from "@/features/customer";

export const metadata: Metadata = {
  title: "Customer Cart",
};


export default function CustomerCartPage() {
  return <CustomerCart />;
}


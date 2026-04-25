import type { Metadata } from "next";
import { ProductPage } from "@/features/marketing";

export const metadata: Metadata = {
  title: "Product",
};


export default function Page() {
  return <ProductPage />;
}

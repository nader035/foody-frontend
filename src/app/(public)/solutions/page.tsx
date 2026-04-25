import type { Metadata } from "next";
import { SolutionsPage } from "@/features/marketing";

export const metadata: Metadata = {
  title: "Solutions",
};


export default function Page() {
  return <SolutionsPage />;
}

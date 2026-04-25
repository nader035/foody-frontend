import type { Metadata } from "next";
import { ManagerOverview } from "@/features/manager";

export const metadata: Metadata = {
  title: "Manager Dashboard",
};


export default function Page() {
  return <ManagerOverview />;
}

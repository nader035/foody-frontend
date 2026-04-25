import type { Metadata } from "next";
import { ManagerReports } from "@/features/manager";

export const metadata: Metadata = {
  title: "Manager Reports",
};


export default function Page() {
  return <ManagerReports />;
}

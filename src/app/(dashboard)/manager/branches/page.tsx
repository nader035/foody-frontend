import type { Metadata } from "next";
import { ManagerBranches } from "@/features/manager";

export const metadata: Metadata = {
  title: "Manager Branches",
};


export default function Page() {
  return <ManagerBranches />;
}

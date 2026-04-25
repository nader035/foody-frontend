import type { Metadata } from "next";
import { BranchStaff } from "@/features/staff";

export const metadata: Metadata = {
  title: "Staff Dashboard",
};


export default function Page() {
  return <BranchStaff />;
}

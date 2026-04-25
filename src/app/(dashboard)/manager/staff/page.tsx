import type { Metadata } from "next";
import { ManagerStaff } from "@/features/manager";

export const metadata: Metadata = {
  title: "Manager Staff",
};


export default function Page() {
  return <ManagerStaff />;
}

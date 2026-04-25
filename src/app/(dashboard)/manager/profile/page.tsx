import type { Metadata } from "next";
import { ManagerProfile } from "@/features/manager";

export const metadata: Metadata = {
  title: "Manager Profile",
};


export default function Page() {
  return <ManagerProfile />;
}

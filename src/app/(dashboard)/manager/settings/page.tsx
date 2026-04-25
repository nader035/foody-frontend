import type { Metadata } from "next";
import { ManagerSettings } from "@/features/manager";

export const metadata: Metadata = {
  title: "Manager Settings",
};


export default function Page() {
  return <ManagerSettings />;
}

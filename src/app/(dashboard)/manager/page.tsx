import type { Metadata } from "next";
import { ManagerOverview } from '@/features/manager/components/manager-overview';

export const metadata: Metadata = {
  title: "Manager Dashboard",
};


export default function Page() {
  return <ManagerOverview />;
}

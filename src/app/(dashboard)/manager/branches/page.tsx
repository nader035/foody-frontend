import type { Metadata } from "next";
import { ManagerBranches } from '@/features/manager/components/manager-branches';

export const metadata: Metadata = {
  title: "Manager Branches",
};


export default function Page() {
  return <ManagerBranches />;
}

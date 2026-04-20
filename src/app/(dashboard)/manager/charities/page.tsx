import type { Metadata } from "next";
import { ManagerCharities } from '@/features/manager/components/manager-charities';

export const metadata: Metadata = {
  title: "Manager Charities",
};


export default function Page() {
  return <ManagerCharities />;
}

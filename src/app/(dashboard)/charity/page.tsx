import type { Metadata } from "next";
import { CharityPortal } from '@/features/charity/components/charity-portal';

export const metadata: Metadata = {
  title: "Charity Dashboard",
};


export default function Page() {
  return <CharityPortal />;
}

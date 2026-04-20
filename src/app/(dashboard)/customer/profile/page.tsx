import type { Metadata } from "next";
import { CustomerProfile } from '@/features/customer/components/customer-profile';

export const metadata: Metadata = {
  title: "Customer Profile",
};


export default function Page() {
  return <CustomerProfile />;
}

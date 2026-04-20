'use client';
import { ManagerLayout } from '@/features/manager/components/manager-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ManagerLayout>{children}</ManagerLayout>;
}

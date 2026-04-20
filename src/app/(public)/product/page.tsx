import type { Metadata } from "next";
import { ProductPage } from '@/features/marketing/components/product/product-page';

export const metadata: Metadata = {
  title: "Product",
};


export default function Page() {
  return <ProductPage />;
}

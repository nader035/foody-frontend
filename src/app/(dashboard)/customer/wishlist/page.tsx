import type { Metadata } from "next";
import { CustomerWishlist } from "@/features/customer/components/customer-wishlist";

export const metadata: Metadata = {
  title: "Customer Wishlist",
};

export default function CustomerWishlistPage() {
  return <CustomerWishlist />;
}

import type { ReactNode } from "react";
import { CartProvider, WishlistProvider } from "@/features/customer";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  );
}

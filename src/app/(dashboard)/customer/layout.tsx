import type { ReactNode } from "react";
import { CartProvider } from "@/features/customer/hooks/cart-context";
import { WishlistProvider } from "@/features/customer/hooks/wishlist-context";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  );
}

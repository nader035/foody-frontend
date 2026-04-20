"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { apiCheckoutOrders, getAuthToken } from "@/lib/api-client";
import { useCart } from "@/features/customer/hooks/cart-context";
import { ImageWithFallback } from "@/components/shared/figma/ImageWithFallback";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CustomerNav } from "@/features/customer/components/customer-nav";

function formatEgp(amount: number) {
  return `E£${amount.toFixed(2)}`;
}

export function CustomerCart() {
  const router = useRouter();
  const {
    items,
    updateQty,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
    totalSavings,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const groupedByBranch = useMemo(() => {
    return items.reduce<Record<string, typeof items>>((acc, item) => {
      const key = item.meal.branchName;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  }, [items]);

  const handleCheckout = async () => {
    if (items.length === 0 || isCheckingOut) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      router.push("/auth");
      return;
    }

    setIsCheckingOut(true);
    setError(null);
    setSuccess(null);

    try {
      const invalidItems = items.filter(
        (item) =>
          item.qty > item.meal.maxAvailable || item.meal.maxAvailable <= 0,
      );

      if (invalidItems.length > 0) {
        setError(
          "Some items exceed current stock. Reduce quantities and try again.",
        );
        return;
      }

      const result = await apiCheckoutOrders({
        items: items.map((item) => ({
          mealId: item.mealId,
          quantity: item.qty,
        })),
      });

      if (result.successfulItems > 0) {
        const succeededMealIds = new Set(
          result.orders.map((order) => order.mealId),
        );
        items.forEach((item) => {
          if (succeededMealIds.has(item.mealId)) {
            removeItem(item.mealId);
          }
        });
      }

      if (result.failedItems > 0 && result.successfulItems > 0) {
        setError(
          `Placed ${result.successfulItems} cart items. ${result.failedItems} failed: ${result.failures
            .map((failure) => failure.message)
            .slice(0, 2)
            .join(" | ")}`,
        );
        return;
      }

      if (result.failedItems > 0) {
        setError(
          result.failures
            .map((failure) => failure.message)
            .slice(0, 2)
            .join(" | ") ||
            "Could not place your order right now. Please try again.",
        );
        return;
      }

      clearCart();
      setSuccess(
        `Your order was placed successfully (${result.totalMealsReserved} meals).`,
      );
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout failed",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <CustomerNav active="cart" title="Your Cart" backHref="/customer" />

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-linear-to-r from-[#155433] to-[#0E3442] rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-20 w-40 h-40 bg-[#25A05F] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-24 w-28 h-28 bg-[#25A05F] rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div
                className="inline-flex items-center gap-1.5 bg-[#25A05F]/20 text-[#25A05F] text-xs px-3 py-1 rounded-full mb-3"
                style={{ fontWeight: 600 }}
              >
                <Leaf size={12} /> Food rescue checkout
              </div>
              <h1
                className="text-white text-2xl sm:text-3xl"
                style={{ fontWeight: 800 }}
              >
                Your cart
              </h1>
              <p className="text-white/60 text-sm mt-1">
                Review items, then place your order in one step.
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-[#25A05F] text-2xl"
                style={{ fontWeight: 800 }}
              >
                {totalItems}
              </p>
              <p className="text-white/50 text-xs">items selected</p>
            </div>
          </div>
        </div>

        {error ? (
          <Alert className="mb-4 border-red-200 bg-red-50 text-red-700">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {success ? (
          <Alert className="mb-4 border-green-200 bg-green-50 text-green-700">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        ) : null}

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 sm:p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#25A05F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-6 w-6 text-[#25A05F]" />
            </div>
            <h2
              className="text-[#0E3442] text-xl mb-2"
              style={{ fontWeight: 700 }}
            >
              Your cart is empty
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Add meals from listings to start your order.
            </p>
            <Button
              asChild
              className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white"
            >
              <Link href="/customer">Browse meals</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-5">
              {Object.entries(groupedByBranch).map(([branch, branchItems]) => (
                <div
                  key={branch}
                  className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm"
                >
                  <div className="mb-4">
                    <h3 className="text-[#0E3442]" style={{ fontWeight: 700 }}>
                      {branch}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {branchItems[0]?.meal.branchAddress}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {branchItems.map((item) => (
                      <div
                        key={item.mealId}
                        className="flex gap-3 rounded-xl border border-gray-100 p-3 hover:border-[#25A05F]/30 transition-colors"
                      >
                        <div className="relative h-20 w-24 overflow-hidden rounded-lg bg-gray-100">
                          <ImageWithFallback
                            src={item.meal.image}
                            alt={item.meal.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                          <div>
                            <p
                              className="truncate text-[#0E3442]"
                              style={{ fontWeight: 700 }}
                            >
                              {item.meal.title}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {item.meal.category}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              Available now: {item.meal.maxAvailable}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 rounded-lg border bg-white p-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                disabled={item.qty <= 1}
                                onClick={() =>
                                  updateQty(item.mealId, item.qty - 1)
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-6 text-center text-sm">
                                {item.qty}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                disabled={
                                  item.qty >=
                                  Math.max(
                                    1,
                                    Math.min(10, item.meal.maxAvailable),
                                  )
                                }
                                onClick={() =>
                                  updateQty(item.mealId, item.qty + 1)
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className="text-sm text-[#0E3442]"
                                style={{ fontWeight: 800 }}
                              >
                                {formatEgp(item.meal.unitPrice * item.qty)}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700"
                                onClick={() => removeItem(item.mealId)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm h-fit lg:sticky lg:top-20">
              <h3 className="text-[#0E3442] mb-1" style={{ fontWeight: 700 }}>
                Order summary
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Checkout validates all cart items and reserves available meals.
              </p>
              <p className="text-xs text-gray-500 mb-4">All prices in EGP.</p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Savings</span>
                  <span className="text-[#25A05F]" style={{ fontWeight: 600 }}>
                    -{formatEgp(totalSavings)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3 text-base">
                  <span className="text-[#0E3442]" style={{ fontWeight: 700 }}>
                    Total
                  </span>
                  <span className="text-[#0E3442]" style={{ fontWeight: 800 }}>
                    {formatEgp(totalPrice)}
                  </span>
                </div>
              </div>

              <Button
                className="mt-5 w-full bg-[#25A05F] hover:bg-[#1e8a4f] text-white"
                disabled={isCheckingOut}
                onClick={handleCheckout}
              >
                {isCheckingOut ? "Placing order..." : "Place order"}
              </Button>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/customer")}
                  disabled={isCheckingOut}
                >
                  Browse more
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCart}
                  disabled={isCheckingOut}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { SurplusMeal } from "@/features/customer/api";
import { CustomerNav } from "@/features/customer/components/customer-nav";
import { useWishlist } from "@/features/customer/hooks/wishlist-context";
import { useCart } from "@/features/customer/hooks/cart-context";
import { ImageWithFallback } from "@/shared/media";
import { Heart, Clock, Trash2, Search, MapPin } from "lucide-react";

function formatEgp(amount: number) {
  return `E£${amount.toFixed(2)}`;
}

function timeLeftLabel(expiresAt: string) {
  const diffMinutes = Math.max(
    0,
    Math.floor((new Date(expiresAt).getTime() - Date.now()) / 60000),
  );

  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins.toString().padStart(2, "0")}m left`;
  }

  return `${mins}m left`;
}

function wishlistSnapshotToMeal(
  item: ReturnType<typeof useWishlist>["items"][number],
): SurplusMeal {
  return {
    _id: item.meal.mealId,
    branchId: {
      _id: item.meal.mealId,
      name: item.meal.branchName,
      address: {
        line1: item.meal.branchAddress,
      },
    },
    createdBy: "wishlist-local",
    title: item.meal.title,
    description: "Added from wishlist",
    category: item.meal.category,
    quantityTotal: Math.max(1, item.meal.maxAvailable),
    quantityAvailable: Math.max(1, item.meal.maxAvailable),
    unitPrice: item.meal.unitPrice,
    currency: item.meal.currency || "EGP",
    visibility: {
      allowDonation: false,
      allowMarketplace: true,
    },
    status: "available",
    expiresAt: item.meal.expiresAt,
    images: [item.meal.image],
    allergens: [],
    tags: ["wishlist"],
    createdAt: item.addedAt,
    updatedAt: item.addedAt,
  };
}

export function CustomerWishlist() {
  const router = useRouter();
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem, isInCart } = useCart();

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.addedAt.localeCompare(a.addedAt)),
    [items],
  );

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <CustomerNav active="wishlist" title="My Wishlist" backHref="/customer" />

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-linear-to-r from-[#155433] to-[#0E3442] rounded-2xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-20 w-40 h-40 bg-[#25A05F] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-24 w-28 h-28 bg-[#25A05F] rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex items-end justify-between gap-4">
            <div>
              <div
                className="inline-flex items-center gap-1.5 bg-[#25A05F]/20 text-[#25A05F] text-xs px-3 py-1 rounded-full mb-3"
                style={{ fontWeight: 600 }}
              >
                <Heart size={12} /> Your saved meals
              </div>
              <h1 className="text-white text-3xl" style={{ fontWeight: 800 }}>
                Wishlist
              </h1>
              <p className="text-white/60 text-sm mt-1">
                Keep track of meals you want to order later.
              </p>
            </div>
            {sortedItems.length > 0 ? (
              <button
                onClick={clearWishlist}
                className="px-3 py-2 rounded-xl border border-white/25 text-white hover:bg-white/10 transition-colors text-sm"
                style={{ fontWeight: 600 }}
              >
                Clear wishlist
              </button>
            ) : null}
          </div>
        </div>

        {sortedItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 sm:p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#25A05F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-[#25A05F]" />
            </div>
            <h2
              className="text-[#0E3442] text-xl mb-2"
              style={{ fontWeight: 700 }}
            >
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Save meals from the marketplace using the heart icon.
            </p>
            <button
              onClick={() => router.push("/customer")}
              className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-5 py-2.5 rounded-xl text-sm"
              style={{ fontWeight: 700 }}
            >
              Browse meals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sortedItems.map((item) => (
              <div
                key={item.mealId}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all"
              >
                <div
                  className="relative h-44 overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/customer/meal/${item.mealId}`)}
                >
                  <ImageWithFallback
                    src={item.meal.image}
                    alt={item.meal.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      removeItem(item.mealId);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 text-red-500 hover:bg-white flex items-center justify-center"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                    <span
                      className="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-gray-500"
                      style={{ fontWeight: 600 }}
                    >
                      {item.meal.category}
                    </span>
                    <span className="text-gray-400">
                      saved {new Date(item.addedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3
                    className="text-[#0E3442] mb-1"
                    style={{ fontWeight: 700 }}
                  >
                    {item.meal.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                    <MapPin size={11} /> {item.meal.branchName}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                    <Clock size={11} /> {timeLeftLabel(item.meal.expiresAt)}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[#25A05F] text-xl"
                      style={{ fontWeight: 800 }}
                    >
                      {formatEgp(item.meal.unitPrice)}
                    </span>
                    <button
                      onClick={() => addItem(wishlistSnapshotToMeal(item), 1)}
                      className={`px-3.5 py-2 rounded-lg text-xs transition-all ${
                        isInCart(item.mealId)
                          ? "bg-[#155433] text-white"
                          : "bg-[#25A05F] text-white hover:bg-[#1e8a4f]"
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {isInCart(item.mealId) ? "In cart" : "Add to cart"}
                    </button>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/customer/meal/${item.mealId}`)
                      }
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-600 hover:border-[#25A05F] hover:text-[#25A05F]"
                      style={{ fontWeight: 600 }}
                    >
                      View details
                    </button>
                    <button
                      onClick={() => removeItem(item.mealId)}
                      className="px-3 py-2 text-xs rounded-lg border border-red-100 text-red-500 hover:bg-red-50"
                      style={{ fontWeight: 600 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

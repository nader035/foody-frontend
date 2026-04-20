"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { SurplusMeal } from "@/lib/api-client";

export interface WishlistMealSnapshot {
  mealId: string;
  title: string;
  unitPrice: number;
  currency: string;
  category: string;
  branchName: string;
  branchAddress: string;
  image: string;
  expiresAt: string;
  maxAvailable: number;
}

export interface WishlistItem {
  mealId: string;
  addedAt: string;
  meal: WishlistMealSnapshot;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (meal: SurplusMeal) => void;
  removeItem: (mealId: string) => void;
  toggleItem: (meal: SurplusMeal) => void;
  clearWishlist: () => void;
  isInWishlist: (mealId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const wishlistStorageKey = "foody_wishlist";

function toMealSnapshot(meal: SurplusMeal): WishlistMealSnapshot {
  const branchName =
    typeof meal.branchId === "string" ? "Unknown branch" : meal.branchId.name;
  const branchAddress =
    typeof meal.branchId === "string"
      ? "Branch address"
      : [meal.branchId.address?.line1, meal.branchId.address?.city]
          .filter(Boolean)
          .join(", ") || "Branch address";

  return {
    mealId: meal._id,
    title: meal.title,
    unitPrice: meal.unitPrice,
    currency: meal.currency || "EGP",
    category: meal.category,
    branchName,
    branchAddress,
    image:
      meal.images?.[0] ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    expiresAt: meal.expiresAt,
    maxAvailable: Math.max(0, meal.quantityAvailable),
  };
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = localStorage.getItem(wishlistStorageKey);
    if (!raw) {
      setIsReady(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as WishlistItem[];
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch {
      setItems([]);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isReady) {
      return;
    }

    localStorage.setItem(wishlistStorageKey, JSON.stringify(items));
  }, [isReady, items]);

  const addItem = (meal: SurplusMeal) => {
    const snapshot = toMealSnapshot(meal);

    setItems((prev) => {
      const existing = prev.find((item) => item.mealId === meal._id);
      if (existing) {
        return prev.map((item) =>
          item.mealId === meal._id
            ? {
                ...item,
                meal: snapshot,
              }
            : item,
        );
      }

      return [
        {
          mealId: meal._id,
          addedAt: new Date().toISOString(),
          meal: snapshot,
        },
        ...prev,
      ];
    });
  };

  const removeItem = (mealId: string) => {
    setItems((prev) => prev.filter((item) => item.mealId !== mealId));
  };

  const toggleItem = (meal: SurplusMeal) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.mealId === meal._id);
      if (exists) {
        return prev.filter((item) => item.mealId !== meal._id);
      }

      return [
        {
          mealId: meal._id,
          addedAt: new Date().toISOString(),
          meal: toMealSnapshot(meal),
        },
        ...prev,
      ];
    });
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => items.length, [items]);

  const value: WishlistContextType = {
    items,
    addItem,
    removeItem,
    toggleItem,
    clearWishlist,
    isInWishlist: (mealId: string) =>
      items.some((item) => item.mealId === mealId),
    totalItems,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

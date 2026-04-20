"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { SurplusMeal } from "@/lib/api-client";

export interface CartMealSnapshot {
  mealId: string;
  title: string;
  unitPrice: number;
  originalPrice: number;
  maxAvailable: number;
  currency: string;
  category: string;
  branchName: string;
  branchAddress: string;
  image: string;
}

export interface CartItem {
  mealId: string;
  qty: number;
  meal: CartMealSnapshot;
}

interface CartContextType {
  items: CartItem[];
  addItem: (meal: SurplusMeal, qty?: number) => void;
  removeItem: (mealId: string) => void;
  updateQty: (mealId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
  isInCart: (mealId: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

const cartStorageKey = "foody_cart";

function toMealSnapshot(meal: SurplusMeal): CartMealSnapshot {
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
    // Keep a reference point for discount messaging in cart UI.
    originalPrice: Number((meal.unitPrice * 1.54).toFixed(2)),
    maxAvailable: Math.max(0, meal.quantityAvailable),
    currency: meal.currency || "EGP",
    category: meal.category,
    branchName,
    branchAddress,
    image:
      meal.images?.[0] ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  };
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = localStorage.getItem(cartStorageKey);
    if (!raw) {
      setIsReady(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as CartItem[];
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
    localStorage.setItem(cartStorageKey, JSON.stringify(items));
  }, [isReady, items]);

  const addItem = (meal: SurplusMeal, qty = 1) => {
    const snapshot = toMealSnapshot(meal);
    const maxAllowed = Math.max(0, Math.min(10, snapshot.maxAvailable));
    if (maxAllowed <= 0) {
      return;
    }

    const nextQty = Math.max(1, Math.min(maxAllowed, qty));

    setItems((prev) => {
      const existing = prev.find((item) => item.mealId === meal._id);
      if (existing) {
        return prev.map((item) =>
          item.mealId === meal._id
            ? {
                ...item,
                qty: Math.min(maxAllowed, item.qty + nextQty),
                meal: snapshot,
              }
            : item,
        );
      }

      return [...prev, { mealId: meal._id, qty: nextQty, meal: snapshot }];
    });
  };

  const removeItem = (mealId: string) => {
    setItems((prev) => prev.filter((item) => item.mealId !== mealId));
  };

  const updateQty = (mealId: string, qty: number) => {
    setItems((prev) => {
      const target = prev.find((item) => item.mealId === mealId);
      if (!target) {
        return prev;
      }

      if (qty <= 0) {
        return prev.filter((item) => item.mealId !== mealId);
      }

      const maxAllowed = Math.max(1, Math.min(10, target.meal.maxAvailable));

      return prev.map((item) =>
        item.mealId === mealId
          ? { ...item, qty: Math.min(maxAllowed, qty) }
          : item,
      );
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.meal.unitPrice * item.qty, 0),
    [items],
  );

  const totalSavings = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          Math.max(0, item.meal.originalPrice - item.meal.unitPrice) * item.qty,
        0,
      ),
    [items],
  );

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    totalItems,
    totalPrice,
    totalSavings,
    isInCart: (mealId: string) => items.some((item) => item.mealId === mealId),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

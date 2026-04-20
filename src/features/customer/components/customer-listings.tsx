"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Clock,
  MapPin,
  Star,
  Heart,
  SlidersHorizontal,
  Leaf,
} from "lucide-react";
import { ImageWithFallback } from "@/components/shared/figma/ImageWithFallback";
import { apiListMeals, type SurplusMeal } from "@/lib/api-client";
import { useCart } from "@/features/customer/hooks/cart-context";
import { useWishlist } from "@/features/customer/hooks/wishlist-context";
import { CustomerNav } from "@/features/customer/components/customer-nav";

const sortOptions = [
  "Recommended",
  "Price: Low to High",
  "Price: High to Low",
  "Ending Soon",
];

function Countdown({ mins: initialMins }: { mins: number }) {
  const [secs, setSecs] = useState(initialMins * 60);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;

  const timeLabel =
    hours > 0
      ? `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
      : `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border shadow-lg backdrop-blur-md ${hours === 0 && minutes < 30 ? "bg-red-600/90 border-red-300/60 text-white" : "bg-slate-950/75 border-white/20 text-white"}`}
      style={{ fontWeight: 700, textShadow: "0 1px 2px rgba(0, 0, 0, 0.45)" }}
    >
      <Clock size={12} />
      {timeLabel}
    </span>
  );
}

function getBranchName(meal: SurplusMeal) {
  return typeof meal.branchId === "string"
    ? "Unknown branch"
    : meal.branchId.name;
}

function getMealImage(meal: SurplusMeal) {
  return (
    meal.images?.[0] ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  );
}

function formatEgp(amount: number) {
  return `E£${amount.toFixed(2)}`;
}

export function CustomerListings() {
  const navigate = useRouter();
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("All Branches");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Recommended");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [meals, setMeals] = useState<SurplusMeal[]>([]);
  const { addItem, isInCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const maxPrice = Math.max(
    100,
    Math.ceil(meals.reduce((max, meal) => Math.max(max, meal.unitPrice), 0)),
  );

  useEffect(() => {
    let active = true;

    async function loadMeals() {
      try {
        setLoading(true);
        setErrorMessage("");
        const result = await apiListMeals({
          limit: 50,
          sortBy: "createdAt",
          sortDirection: "desc",
        });
        if (active) {
          setMeals(result.items);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : "Failed to load meals",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMeals();

    return () => {
      active = false;
    };
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(meals.map((m) => m.category))).map(
      (c) => c.charAt(0).toUpperCase() + c.slice(1),
    ),
  ];

  const branches = [
    "All Branches",
    ...Array.from(new Set(meals.map((m) => getBranchName(m)))),
  ];

  let filtered = meals.filter((meal) => {
    if (
      search &&
      !meal.title.toLowerCase().includes(search.toLowerCase()) &&
      !meal.category.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    if (branch !== "All Branches" && getBranchName(meal) !== branch) {
      return false;
    }

    if (category !== "All" && meal.category !== category.toLowerCase()) {
      return false;
    }

    if (meal.unitPrice < priceRange[0] || meal.unitPrice > priceRange[1]) {
      return false;
    }

    return true;
  });

  if (sort === "Price: Low to High") {
    filtered = [...filtered].sort((a, b) => a.unitPrice - b.unitPrice);
  } else if (sort === "Price: High to Low") {
    filtered = [...filtered].sort((a, b) => b.unitPrice - a.unitPrice);
  } else if (sort === "Ending Soon") {
    filtered = [...filtered].sort(
      (a, b) =>
        new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime(),
    );
  }

  const handleAddToCart = (meal: SurplusMeal, e: React.MouseEvent) => {
    e.stopPropagation();

    addItem(meal, 1);
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <CustomerNav active="marketplace" title="Customer Marketplace" />

      {/* Advanced Filter Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-[#0E3442] text-sm"
                style={{ fontWeight: 700 }}
              >
                Filter & Sort
              </h3>
              <button
                onClick={() => {
                  setBranch("All Branches");
                  setCategory("All");
                  setSort("Recommended");
                  setPriceRange([0, maxPrice]);
                }}
                className="text-[#25A05F] text-xs"
                style={{ fontWeight: 600 }}
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label
                  className="text-gray-400 text-xs block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#25A05F]"
                >
                  {branches.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="text-gray-400 text-xs block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#25A05F]"
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="text-gray-400 text-xs block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Sort By
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#25A05F]"
                >
                  {sortOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="text-gray-400 text-xs block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Max Price (EGP): E£{priceRange[1]}
                </label>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-[#25A05F] h-2 rounded-full appearance-none bg-gray-200 mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white border border-gray-100 rounded-xl p-3 mb-4 shadow-sm flex items-center gap-3">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search meals, cuisine, restaurants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#25A05F] focus:ring-1 focus:ring-[#25A05F]/20"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#25A05F] text-sm px-3 py-2.5 border border-gray-200 rounded-xl hover:border-[#25A05F] transition-colors"
            style={{ fontWeight: 600 }}
          >
            <SlidersHorizontal size={16} />
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>

        {/* Hero banner */}
        <div className="bg-linear-to-r from-[#155433] to-[#0E3442] rounded-2xl p-8 mb-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-20 w-40 h-40 bg-[#25A05F] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-40 w-32 h-32 bg-[#25A05F] rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-1.5 bg-[#25A05F]/20 text-[#25A05F] text-xs px-3 py-1 rounded-full mb-3"
              style={{ fontWeight: 600 }}
            >
              <Leaf size={12} /> Save food, save money
            </div>
            <h1
              className="text-white text-3xl mb-2"
              style={{ fontWeight: 800 }}
            >
              Surplus meals, half the price
            </h1>
            <p className="text-white/60 text-sm max-w-md">
              Grab quality surplus meals from your favorite local restaurants at
              up to 50% off. Fresh food, affordable prices, zero waste.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-6 relative z-10">
            {[
              { v: "45K+", l: "Meals saved" },
              { v: "320+", l: "Restaurants" },
              { v: "50%", l: "Avg. discount" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p
                  className="text-[#25A05F] text-xl"
                  style={{ fontWeight: 700 }}
                >
                  {s.v}
                </p>
                <p className="text-white/40 text-xs">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${category === c ? "bg-[#25A05F] text-white shadow-md shadow-[#25A05F]/20" : "bg-white border border-gray-200 text-gray-600 hover:border-[#25A05F] hover:text-[#25A05F]"}`}
              style={{ fontWeight: 600 }}
            >
              {c === "All" ? "All Categories" : c}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500 text-sm">
            <span className="text-[#0E3442]" style={{ fontWeight: 700 }}>
              {filtered.length}
            </span>{" "}
            meals available near you
          </p>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            Sort:{" "}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-[#0E3442] focus:outline-none cursor-pointer"
              style={{ fontWeight: 600 }}
            >
              {sortOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Meal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading && (
            <div className="col-span-full text-center py-10 text-gray-500 text-sm">
              Loading meals...
            </div>
          )}

          {!loading &&
            filtered.map((meal) => {
              const branchName = getBranchName(meal);
              const minutesLeft = Math.max(
                0,
                Math.floor(
                  (new Date(meal.expiresAt).getTime() - Date.now()) / 60000,
                ),
              );

              return (
                <div
                  key={meal._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#25A05F]/20 transition-all group cursor-pointer"
                  onClick={() => navigate.push(`/customer/meal/${meal._id}`)}
                >
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={getMealImage(meal)}
                      alt={meal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Countdown mins={minutesLeft} />
                    </div>
                    <div
                      className="absolute top-3 left-3 bg-slate-950/80 text-white text-xs px-2.5 py-1 rounded-full border border-white/20 shadow-lg backdrop-blur-md"
                      style={{
                        fontWeight: 800,
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.45)",
                      }}
                    >
                      50% OFF
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItem(meal);
                      }}
                      className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isInWishlist(meal._id) ? "bg-red-500 text-white" : "bg-white/80 text-gray-400 hover:bg-white hover:text-red-500"}`}
                    >
                      <Heart
                        size={14}
                        fill={isInWishlist(meal._id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                      <span
                        className="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-gray-500"
                        style={{ fontWeight: 600 }}
                      >
                        {meal.category}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Star
                          size={10}
                          className="text-yellow-400"
                          fill="currentColor"
                        />
                        4.8
                      </span>
                    </div>
                    <h3
                      className="text-[#0E3442] mb-1"
                      style={{ fontWeight: 700 }}
                    >
                      {meal.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                      <MapPin size={11} /> {branchName}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-[#25A05F] text-xl"
                          style={{ fontWeight: 800 }}
                        >
                          {formatEgp(meal.unitPrice)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(meal, e)}
                        className={`px-3.5 py-2 rounded-lg text-xs transition-all ${isInCart(meal._id) ? "bg-[#155433] text-white" : "bg-[#25A05F] text-white hover:bg-[#1e8a4f] active:scale-95"}`}
                        style={{ fontWeight: 600 }}
                      >
                        {isInCart(meal._id) ? "In cart" : "Add to cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-300" />
            </div>
            <h3
              className="text-[#0E3442] text-lg mb-2"
              style={{ fontWeight: 700 }}
            >
              No meals found
            </h3>
            <p className="text-gray-400 text-sm">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-5 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">
            Customer marketplace navigation upgraded for faster daily use.
          </p>
          <button
            onClick={() => navigate.push("/customer/wishlist")}
            className="text-xs text-[#25A05F] hover:text-[#155433]"
            style={{ fontWeight: 700 }}
          >
            Go to wishlist
          </button>
        </div>
      </footer>
    </div>
  );
}

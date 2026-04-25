"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImageWithFallback } from "@/shared/media";
import {
  Clock,
  MapPin,
  Star,
  Heart,
  ShoppingBag,
  Share2,
  Shield,
  Leaf,
  ChevronRight,
  Minus,
  Plus,
  AlertTriangle,
  Check,
} from "lucide-react";
import {
  apiGetMealById,
  apiListMeals,
  type SurplusMeal,
} from "@/features/customer/api";
import { CustomerNav } from "@/features/customer/components/customer-nav";
import { useCart } from "@/features/customer/hooks/cart-context";
import { useWishlist } from "@/features/customer/hooks/wishlist-context";

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
      className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md ${hours === 0 && minutes < 30 ? "bg-red-600/90 border-red-300/60 text-white" : "bg-slate-950/75 border-white/20 text-white"}`}
      style={{ fontWeight: 700, textShadow: "0 1px 2px rgba(0, 0, 0, 0.45)" }}
    >
      <Clock size={14} />
      {timeLabel} left
    </span>
  );
}

const reviews: Array<{
  name: string;
  rating: number;
  text: string;
  time: string;
}> = [];

function formatEgp(amount: number) {
  return `E£${amount.toFixed(2)}`;
}

export function CustomerMealDetail() {
  const { id } = useParams();
  const navigate = useRouter();
  const [meal, setMeal] = useState<SurplusMeal | null>(null);
  const [similar, setSimilar] = useState<SurplusMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const { addItem, isInCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  useEffect(() => {
    let active = true;

    async function loadMeal() {
      if (!id || typeof id !== "string") {
        setErrorMessage("Invalid meal id");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");
        const fetchedMeal = await apiGetMealById(id);
        if (!active) {
          return;
        }
        setMeal(fetchedMeal);

        const related = await apiListMeals({
          category: fetchedMeal.category,
          limit: 4,
          sortBy: "createdAt",
          sortDirection: "desc",
        });

        if (!active) {
          return;
        }

        setSimilar(
          related.items
            .filter((item) => item._id !== fetchedMeal._id)
            .slice(0, 3),
        );
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : "Failed to load meal",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMeal();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <p className="text-gray-500 text-sm">Loading meal...</p>
      </div>
    );
  }

  if (!meal) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <div className="text-center">
          <h2
            className="text-[#0E3442] text-2xl mb-2"
            style={{ fontWeight: 700 }}
          >
            Meal not found
          </h2>
          {errorMessage && (
            <p className="text-red-600 text-xs mb-3">{errorMessage}</p>
          )}
          <button
            onClick={() => navigate.push("/customer")}
            className="text-[#25A05F] text-sm"
            style={{ fontWeight: 600 }}
          >
            Back to listings
          </button>
        </div>
      </div>
    );
  }

  const branch = typeof meal.branchId === "string" ? null : meal.branchId;
  const mealImage =
    meal.images?.[0] ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
  const mins = Math.max(
    0,
    Math.floor((new Date(meal.expiresAt).getTime() - Date.now()) / 60000),
  );
  const savings = meal.unitPrice * qty * 0.35;

  function handleAddToCart() {
    if (!meal) {
      return;
    }

    addItem(meal, qty);
    setErrorMessage("");
    setAddedToCart(true);
  }

  async function handleShare() {
    if (typeof window === "undefined" || !meal) {
      return;
    }

    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: meal.title,
          text: `Check this meal on Foody: ${meal.title}`,
          url,
        });
        return;
      } catch {
        // Fall back to clipboard copy when share is cancelled/unsupported.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareMessage("Meal link copied.");
      setTimeout(() => setShareMessage(""), 1800);
    } catch {
      setShareMessage("Could not copy link.");
      setTimeout(() => setShareMessage(""), 1800);
    }
  }

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <CustomerNav
        active="marketplace"
        title="Meal Details"
        backHref="/customer"
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-4/3">
              <ImageWithFallback
                src={mealImage}
                alt={meal.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute top-4 left-4 bg-slate-950/80 text-white text-sm px-3 py-1.5 rounded-full border border-white/20 shadow-lg backdrop-blur-md"
                style={{
                  fontWeight: 800,
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.45)",
                }}
              >
                50% OFF
              </div>
              <div className="absolute top-4 right-4">
                <Countdown mins={mins} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: Shield,
                  label: "Quality Guaranteed",
                  desc: "Restaurant verified",
                },
                { icon: Leaf, label: "Waste Reduced", desc: "Save the planet" },
                { icon: Clock, label: "Fresh Today", desc: "Prepared today" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="bg-white rounded-xl p-3 border border-gray-100 text-center"
                >
                  <b.icon size={18} className="text-[#25A05F] mx-auto mb-1" />
                  <p
                    className="text-[#0E3442] text-xs"
                    style={{ fontWeight: 600 }}
                  >
                    {b.label}
                  </p>
                  <p className="text-gray-400 text-[10px]">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="bg-[#25A05F]/10 text-[#25A05F] text-xs px-2.5 py-1 rounded-full"
                  style={{ fontWeight: 600 }}
                >
                  {meal.category}
                </span>
                <span
                  className="bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full"
                  style={{ fontWeight: 600 }}
                >
                  {meal.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleItem(meal)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${isInWishlist(meal._id) ? "bg-red-50 border-red-200 text-red-500" : "border-gray-200 text-gray-400 hover:text-red-500"}`}
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    size={16}
                    fill={isInWishlist(meal._id) ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-400 hover:text-[#25A05F] transition-colors"
                  aria-label="Share meal"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
            <h1
              className="text-[#0E3442] text-3xl mb-2"
              style={{ fontWeight: 800 }}
            >
              {meal.title}
            </h1>
            {shareMessage && (
              <p
                className="text-xs text-[#25A05F] mb-2"
                style={{ fontWeight: 600 }}
              >
                {shareMessage}
              </p>
            )}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-sm">
                <Star
                  size={14}
                  className="text-yellow-400"
                  fill="currentColor"
                />
                <span className="text-[#0E3442]" style={{ fontWeight: 700 }}>
                  4.8
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <MapPin size={14} /> {branch?.name || "Branch"}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-5">
              <div className="flex items-baseline gap-3 mb-2">
                <span
                  className="text-[#25A05F] text-4xl"
                  style={{ fontWeight: 800 }}
                >
                  {formatEgp(meal.unitPrice)}
                </span>
              </div>
              <p
                className="text-[#25A05F] text-sm mb-4"
                style={{ fontWeight: 600 }}
              >
                Estimated savings {formatEgp(savings)} with this order
              </p>
              <p className="text-xs text-gray-400 mb-4">All prices in EGP.</p>

              <div className="flex items-center justify-between mb-4 py-3 border-y border-gray-100">
                <span
                  className="text-gray-600 text-sm"
                  style={{ fontWeight: 600 }}
                >
                  Quantity (available {meal.quantityAvailable})
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span
                    className="text-[#0E3442] w-6 text-center"
                    style={{ fontWeight: 700 }}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() =>
                      setQty(Math.min(meal.quantityAvailable, qty + 1))
                    }
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-500">Total</span>
                <span
                  className="text-[#0E3442] text-xl"
                  style={{ fontWeight: 800 }}
                >
                  {formatEgp(meal.unitPrice * qty)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${isInCart(meal._id) ? "bg-[#155433] text-white" : "bg-[#25A05F] hover:bg-[#1e8a4f] text-white active:scale-[0.98]"}`}
                style={{ fontWeight: 700 }}
              >
                {isInCart(meal._id) || addedToCart ? (
                  <>
                    <Check size={16} /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Cart
                  </>
                )}
              </button>
              {errorMessage && (
                <p className="text-red-600 text-xs mt-2">{errorMessage}</p>
              )}
              {addedToCart && (
                <p className="text-green-700 text-xs mt-2">
                  Meal added to cart. Continue browsing or open cart to
                  checkout.
                </p>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-5">
              <h4
                className="text-[#0E3442] text-sm mb-3"
                style={{ fontWeight: 700 }}
              >
                Pickup Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={14} className="text-[#25A05F] shrink-0" />
                  <span>{branch?.address?.line1 || "Branch address"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock size={14} className="text-[#25A05F] shrink-0" />
                  <span>
                    Pickup window: now to {Math.floor(mins / 60)}h{" "}
                    {Math.floor(mins % 60)}m 00s
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                {(["details", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-sm transition-colors ${activeTab === tab ? "text-[#25A05F] border-b-2 border-[#25A05F]" : "text-gray-400"}`}
                    style={{ fontWeight: 600 }}
                  >
                    {tab === "details" ? "Details & Ingredients" : "Reviews"}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {activeTab === "details" ? (
                  <div className="space-y-5">
                    <div>
                      <h4
                        className="text-[#0E3442] text-sm mb-2"
                        style={{ fontWeight: 700 }}
                      >
                        Description
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {meal.description || "No description provided."}
                      </p>
                    </div>
                    <div>
                      <h4
                        className="text-[#0E3442] text-sm mb-2"
                        style={{ fontWeight: 700 }}
                      >
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {meal.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {meal.tags.length === 0 && (
                          <span className="text-gray-400 text-xs">No tags</span>
                        )}
                      </div>
                    </div>
                    {meal.allergens.length > 0 && (
                      <div>
                        <h4
                          className="text-[#0E3442] text-sm mb-2 flex items-center gap-1.5"
                          style={{ fontWeight: 700 }}
                        >
                          <AlertTriangle
                            size={14}
                            className="text-orange-400"
                          />{" "}
                          Allergens
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {meal.allergens.map((allergen) => (
                            <span
                              key={allergen}
                              className="bg-orange-50 text-orange-600 text-xs px-3 py-1.5 rounded-full"
                              style={{ fontWeight: 600 }}
                            >
                              {allergen}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.length === 0 && (
                      <p className="text-gray-400 text-sm">
                        No reviews yet for this meal.
                      </p>
                    )}
                    {reviews.map((r, i) => (
                      <div
                        key={i}
                        className="pb-4 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-full bg-[#25A05F]/10 flex items-center justify-center text-[#25A05F] text-xs"
                              style={{ fontWeight: 700 }}
                            >
                              {r.name[0]}
                            </div>
                            <div>
                              <p
                                className="text-[#0E3442] text-sm"
                                style={{ fontWeight: 600 }}
                              >
                                {r.name}
                              </p>
                              <p className="text-gray-400 text-[10px]">
                                {r.time}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: r.rating }).map((_, j) => (
                              <Star
                                key={j}
                                size={12}
                                className="text-yellow-400"
                                fill="currentColor"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <h2
                className="text-[#0E3442] text-xl"
                style={{ fontWeight: 700 }}
              >
                You might also like
              </h2>
              <button
                onClick={() => navigate.push("/customer")}
                className="text-[#25A05F] text-sm flex items-center gap-1"
                style={{ fontWeight: 600 }}
              >
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map((m) => (
                <div
                  key={m._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => navigate.push(`/customer/meal/${m._id}`)}
                >
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={m.images?.[0] || mealImage}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className="absolute top-3 left-3 bg-[#25A05F] text-white text-xs px-2.5 py-1 rounded-full"
                      style={{ fontWeight: 700 }}
                    >
                      50% OFF
                    </div>
                  </div>
                  <div className="p-4">
                    <h3
                      className="text-[#0E3442] mb-1"
                      style={{ fontWeight: 700 }}
                    >
                      {m.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-[#25A05F] text-lg"
                          style={{ fontWeight: 800 }}
                        >
                          {formatEgp(m.unitPrice)}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Star
                          size={10}
                          className="text-yellow-400"
                          fill="currentColor"
                        />{" "}
                        4.8
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

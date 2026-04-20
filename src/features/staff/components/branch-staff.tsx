"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import {
  apiListMeals,
  apiCreateMeal,
  apiCreateDonation,
  apiListDonations,
  apiListCharities,
  apiListBranches,
  apiGetMe,
  apiUpdateMe,
  clearAuthSession,
  type SurplusMeal,
  type Donation,
  type CharityUser,
  type UserProfile,
  type Branch,
} from "@/lib/api-client";
import {
  Clock,
  Plus,
  Minus,
  Send,
  Heart,
  ShoppingBag,
  Bell,
  ClipboardList,
  User,
  LogOut,
  History,
  Package,
  Check,
  MapPin,
  Mail,
  Phone,
  Building2,
  Edit3,
  Save,
  Calendar,
  AlertTriangle,
  RefreshCw,
  BarChart3,
} from "lucide-react";

type BranchRef = {
  _id?: string;
  name?: string;
};

type Tab =
  | "dashboard"
  | "log"
  | "donations"
  | "history"
  | "notifications"
  | "profile";

function parseDelimitedList(raw: string) {
  return raw
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseImageUrls(raw: string) {
  const valid: string[] = [];
  const invalid: string[] = [];

  parseDelimitedList(raw).forEach((value) => {
    try {
      const url = new URL(value);
      if (!["http:", "https:"].includes(url.protocol)) {
        invalid.push(value);
        return;
      }
      valid.push(url.toString());
    } catch {
      invalid.push(value);
    }
  });

  return { valid, invalid };
}

export function BranchStaff() {
  const navigate = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myBranch, setMyBranch] = useState<Branch | null>(null);
  const [meals, setMeals] = useState<SurplusMeal[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [charities, setCharities] = useState<CharityUser[]>([]);

  // Log Form State
  const [mealName, setMealName] = useState("");
  const [quantity, setQuantity] = useState(20);
  const [expiry, setExpiry] = useState("22:00");
  const [category, setCategory] = useState("Main Course");
  const [notes, setNotes] = useState("");
  const [unitPrice, setUnitPrice] = useState(50);
  const [imageUrlsInput, setImageUrlsInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [allergensInput, setAllergensInput] = useState("");
  const [allowDonation, setAllowDonation] = useState(true);
  const [allowMarketplace, setAllowMarketplace] = useState(true);
  const [logCharityId, setLogCharityId] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Donation Form State
  const [donationMealId, setDonationMealId] = useState("");
  const [donationCharityId, setDonationCharityId] = useState("");
  const [donationQty, setDonationQty] = useState(1);
  const [donationNotes, setDonationNotes] = useState("");
  const [donating, setDonating] = useState(false);
  const [donationSaved, setDonationSaved] = useState(false);

  // Profile Edit
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState("");

  const [notifications] = useState([
    {
      id: 1,
      text: "Reminder: Log surplus before 9 PM",
      time: "3 hrs ago",
      read: true,
      type: "alert",
    },
  ]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const me = await apiGetMe();
      setProfile(me);
      setFullName(me.fullName);

      const [branchRes, mealRes, donationRes, charitiesRes] = await Promise.all(
        [
          apiListBranches({ limit: 100 }),
          apiListMeals({
            limit: 100,
            sortBy: "createdAt",
            sortDirection: "desc",
          }),
          apiListDonations({
            limit: 100,
            sortBy: "createdAt",
            sortDirection: "desc",
          }),
          apiListCharities(),
        ],
      );

      const branch =
        branchRes.items.find((b) => b._id === me.branchId) ||
        branchRes.items.find((b) => b.name === me.branchName) ||
        null;
      setMyBranch(branch);
      if (branch) {
        setAllowDonation((branch.settings?.donationSplitPercentage ?? 30) > 0);
        setAllowMarketplace(branch.settings?.publicListingEnabled ?? true);
      }

      // Backend returns all branch meals. Filter if needed.
      const branchMeals = mealRes.items.filter((m) => {
        const branchRef: BranchRef | null =
          typeof m.branchId === "string" ? null : (m.branchId as BranchRef);
        const mBranchName = branchRef?.name || "Unknown";
        const mBranchId =
          branchRef?._id || (typeof m.branchId === "string" ? m.branchId : "");
        return (
          mBranchName === me.branchName || (branch && mBranchId === branch._id)
        );
      });
      setMeals(branchMeals);
      setDonations(donationRes.items);
      setCharities(charitiesRes);

      const donationEligibleMeals = branchMeals.filter(
        (meal) =>
          meal.visibility.allowDonation &&
          meal.quantityAvailable > 0 &&
          ["available", "reserved"].includes(meal.status),
      );

      setDonationMealId((current) => {
        if (
          current &&
          donationEligibleMeals.some((meal) => meal._id === current)
        ) {
          return current;
        }

        return donationEligibleMeals[0]?._id || "";
      });

      setDonationCharityId((current) => {
        if (
          current &&
          charitiesRes.some((charity) => charity._id === current)
        ) {
          return current;
        }

        return charitiesRes[0]?._id || "";
      });

      setLogCharityId((current) => {
        if (
          current &&
          charitiesRes.some((charity) => charity._id === current)
        ) {
          return current;
        }

        return charitiesRes[0]?._id || "";
      });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const donationEligibleMeals = useMemo(
    () =>
      meals.filter(
        (meal) =>
          meal.visibility.allowDonation &&
          meal.quantityAvailable > 0 &&
          ["available", "reserved"].includes(meal.status),
      ),
    [meals],
  );

  const selectedDonationMeal = useMemo(
    () => donationEligibleMeals.find((meal) => meal._id === donationMealId),
    [donationEligibleMeals, donationMealId],
  );

  const selectedDonationCharity = useMemo(
    () => charities.find((charity) => charity._id === donationCharityId),
    [charities, donationCharityId],
  );

  const charityNameById = useMemo(
    () =>
      new Map(
        charities.map((charity) => [
          charity._id,
          charity.organizationName || charity.fullName,
        ]),
      ),
    [charities],
  );

  useEffect(() => {
    if (!selectedDonationMeal) {
      setDonationQty(1);
      return;
    }

    setDonationQty((currentQty) => {
      const bounded = Math.max(
        1,
        Math.min(currentQty, selectedDonationMeal.quantityAvailable),
      );
      return bounded;
    });
  }, [selectedDonationMeal]);

  const donationPct = Math.max(
    0,
    Math.min(100, myBranch?.settings?.donationSplitPercentage ?? 30),
  );
  const discountPct = myBranch?.settings?.discountPercentage ?? 50;

  const effectiveDonationPct = allowDonation
    ? allowMarketplace
      ? donationPct
      : 100
    : 0;

  const donatedPreview = Math.min(
    quantity,
    Math.round((quantity * effectiveDonationPct) / 100),
  );
  const discountedPreview = Math.max(0, quantity - donatedPreview);

  const canSubmitLog =
    mealName.trim().length >= 2 &&
    quantity > 0 &&
    unitPrice >= 0 &&
    (allowDonation || allowMarketplace) &&
    (!allowDonation || donatedPreview === 0 || Boolean(logCharityId)) &&
    !submitting;

  const handleSubmit = async () => {
    if (!myBranch) return;

    if (!allowDonation && !allowMarketplace) {
      setErrorMessage(
        "Enable at least one destination: donation or customer marketplace.",
      );
      return;
    }

    if (allowDonation && donatedPreview > 0 && !logCharityId) {
      setErrorMessage("Select a charity to route the donation allocation.");
      return;
    }

    const parsedImages = parseImageUrls(imageUrlsInput);
    if (parsedImages.invalid.length > 0) {
      setErrorMessage(
        `Invalid image URL(s): ${parsedImages.invalid.slice(0, 3).join(", ")}`,
      );
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");
      setSubmitMessage("");

      const today = new Date();
      const [hh, mm] = expiry.split(":");
      today.setHours(Number(hh), Number(mm), 0, 0);

      const createdMeal = await apiCreateMeal({
        title: mealName.trim(),
        category: category,
        description: notes.trim() || undefined,
        quantityTotal: quantity,
        unitPrice: unitPrice,
        currency: "EGP",
        visibility: {
          allowDonation,
          allowMarketplace,
        },
        status: "available",
        expiresAt: today.toISOString(),
        images: parsedImages.valid,
        allergens: parseDelimitedList(allergensInput),
        tags: parseDelimitedList(tagsInput),
        branchId: myBranch._id,
      });

      let autoDonationCreated = false;

      if (allowDonation && donatedPreview > 0) {
        try {
          await apiCreateDonation({
            mealId: createdMeal._id,
            charityId: logCharityId,
            quantity: donatedPreview,
            notes: `Auto-routed ${effectiveDonationPct}% from surplus log`,
          });
          autoDonationCreated = true;
        } catch (error) {
          setSubmitted(true);
          setSubmitMessage(
            "Meal logged, but auto-donation failed. Complete routing from Donations tab.",
          );
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Meal logged, but donation routing failed",
          );
          await loadData();
          setTimeout(() => {
            setSubmitted(false);
            setActiveTab("donations");
          }, 2200);
          return;
        }
      }

      setSubmitted(true);
      setSubmitMessage(
        autoDonationCreated
          ? `${donatedPreview} meal(s) routed to donation, ${discountedPreview} available for customers.`
          : allowMarketplace
            ? `${discountedPreview} meal(s) now listed for customers.`
            : "Surplus logged successfully.",
      );

      await loadData();

      setTimeout(() => {
        setSubmitted(false);
        setSubmitMessage("");
        setMealName("");
        setQuantity(20);
        setUnitPrice(50);
        setNotes("");
        setImageUrlsInput("");
        setAllergensInput("");
        setTagsInput("");
        setAllowDonation(
          (myBranch.settings?.donationSplitPercentage ?? 30) > 0,
        );
        setAllowMarketplace(myBranch.settings?.publicListingEnabled ?? true);
        setActiveTab("dashboard");
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to log surplus",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updated = await apiUpdateMe({ fullName });
      setProfile(updated);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    }
  };

  const handleCreateDonation = async () => {
    if (!selectedDonationMeal || !selectedDonationCharity) {
      setErrorMessage("Please select a meal and a charity");
      return;
    }

    try {
      setDonating(true);
      setErrorMessage("");

      await apiCreateDonation({
        mealId: selectedDonationMeal._id,
        charityId: selectedDonationCharity._id,
        quantity: donationQty,
        notes: donationNotes || undefined,
      });

      setDonationSaved(true);
      setDonationNotes("");
      setDonationQty(1);
      await loadData();
      setTimeout(() => setDonationSaved(false), 1800);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create donation",
      );
    } finally {
      setDonating(false);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate.push("/auth");
  };

  // Stats Logic
  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const donationQtyByMealId = useMemo(() => {
    const quantities = new Map<string, number>();

    donations.forEach((donation) => {
      if (["cancelled", "no_show"].includes(donation.status)) {
        return;
      }

      const current = quantities.get(donation.mealId) || 0;
      quantities.set(donation.mealId, current + donation.quantity);
    });

    return quantities;
  }, [donations]);

  const todaysMeals = useMemo(() => {
    return meals.filter((m) => new Date(m.createdAt || 0) >= todayStart);
  }, [meals, todayStart]);

  const todayStats = {
    totalMeals: todaysMeals.reduce((s, m) => s + m.quantityTotal, 0),
    totalDonated: todaysMeals.reduce(
      (s, m) =>
        s + Math.min(m.quantityTotal, donationQtyByMealId.get(m._id) || 0),
      0,
    ),
    entries: todaysMeals.length,
    totalSold: 0,
  };
  todayStats.totalSold = Math.max(
    0,
    todayStats.totalMeals - todayStats.totalDonated,
  );

  const todaysLog = todaysMeals.map((m) => {
    const donated = Math.min(
      m.quantityTotal,
      donationQtyByMealId.get(m._id) || 0,
    );
    const d = new Date(m.createdAt || 0);
    return {
      id: m._id,
      meal: m.title,
      qty: m.quantityTotal,
      donated,
      sold: m.quantityTotal - donated,
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: m.status,
      canDonate:
        m.visibility.allowDonation &&
        m.quantityAvailable > 0 &&
        ["available", "reserved"].includes(m.status),
    };
  });

  const weekHistory = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dayMeals = meals.filter(
        (m) =>
          new Date(m.createdAt || 0) >= d && new Date(m.createdAt || 0) < nextD,
      );

      const totalQty = dayMeals.reduce((s, m) => s + m.quantityTotal, 0);
      const donated = dayMeals.reduce(
        (s, m) =>
          s + Math.min(m.quantityTotal, donationQtyByMealId.get(m._id) || 0),
        0,
      );

      days.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        meals: dayMeals.length,
        totalQty,
        donated,
        sold: totalQty - donated,
      });
    }
    return days;
  }, [meals, donationQtyByMealId]);

  const navItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "log", icon: ClipboardList, label: "Log Surplus" },
    { id: "donations", icon: Heart, label: "Donations" },
    { id: "history", icon: History, label: "History" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "profile", icon: User, label: "Profile" },
  ] as const;

  const [date1, setDate1] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });
  const [date2, setDate2] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      <aside className="w-56 bg-white flex flex-col shrink-0 border-r border-gray-100 shadow-sm">
        <div
          className="p-5 pb-6 cursor-pointer"
          onClick={() => navigate.push("/")}
        >
          <Logo size="sm" />
        </div>
        <div className="px-4 mb-4">
          <div className="bg-[#25A05F]/10 rounded-xl p-3 text-center">
            <p className="text-[#25A05F] text-xs" style={{ fontWeight: 600 }}>
              Branch Staff
            </p>
            <p
              className="text-[#0E3442] text-sm mt-0.5"
              style={{ fontWeight: 700 }}
            >
              {profile?.branchName || "Loading..."}
            </p>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                activeTab === item.id
                  ? "bg-[#25A05F]/10 text-[#25A05F]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
              style={{ fontWeight: activeTab === item.id ? 600 : 500 }}
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-3 pb-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto flex flex-col">
        <header className="shrink-0 bg-white px-6 py-3.5 flex items-center justify-between border-b border-gray-100 shadow-sm">
          <div>
            <h1 className="text-[#0E3442] text-lg" style={{ fontWeight: 700 }}>
              {activeTab === "dashboard"
                ? "Dashboard"
                : activeTab === "log"
                  ? "Log Surplus"
                  : activeTab === "donations"
                    ? "Create Donation"
                    : activeTab === "history"
                      ? "History"
                      : activeTab === "notifications"
                        ? "Notifications"
                        : "My Profile"}
            </h1>
            <p className="text-gray-400 text-xs">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="relative text-gray-400 hover:text-[#25A05F] transition-colors"
              onClick={loadData}
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <div
              className="w-9 h-9 rounded-full bg-[#25A05F] flex items-center justify-center text-white text-sm cursor-pointer shadow-sm"
              style={{ fontWeight: 700 }}
              onClick={() => setActiveTab("profile")}
            >
              {profile?.fullName
                ?.split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "S"}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {errorMessage && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
              <AlertTriangle size={14} /> {errorMessage}
            </div>
          )}

          {activeTab === "dashboard" && (
            <>
              <div className="mb-6">
                <h2
                  className="text-[#0E3442] text-xl"
                  style={{ fontWeight: 700 }}
                >
                  Today&apos;s Overview
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Quick snapshot of today&apos;s surplus activity
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Total Meals",
                    value: todayStats.totalMeals,
                    icon: Package,
                    color: "#25A05F",
                  },
                  {
                    label: "Donated",
                    value: todayStats.totalDonated,
                    icon: Heart,
                    color: "#155433",
                  },
                  {
                    label: "Sold",
                    value: todayStats.totalSold,
                    icon: ShoppingBag,
                    color: "#0E3442",
                  },
                  {
                    label: "Log Entries",
                    value: todayStats.entries,
                    icon: ClipboardList,
                    color: "#25A05F",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                  >
                    <div
                      className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center"
                      style={{ backgroundColor: s.color + "1A" }}
                    >
                      <s.icon size={18} style={{ color: s.color }} />
                    </div>
                    <p
                      className="text-[#0E3442] text-2xl"
                      style={{ fontWeight: 700 }}
                    >
                      {loading ? "—" : s.value}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 pb-3 flex items-center justify-between">
                    <h3 className="text-[#0E3442]" style={{ fontWeight: 600 }}>
                      Today&apos;s Log
                    </h3>
                    <button
                      onClick={() => setActiveTab("log")}
                      className="text-[#25A05F] text-sm flex items-center gap-1"
                      style={{ fontWeight: 600 }}
                    >
                      <Plus size={14} /> Add Entry
                    </button>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-[#F5F7FA]">
                        <th
                          className="text-left text-gray-500 px-5 py-2.5"
                          style={{ fontWeight: 600 }}
                        >
                          Meal
                        </th>
                        <th
                          className="text-right text-gray-500 px-5 py-2.5"
                          style={{ fontWeight: 600 }}
                        >
                          Qty
                        </th>
                        <th
                          className="text-right text-gray-500 px-5 py-2.5"
                          style={{ fontWeight: 600 }}
                        >
                          Donated
                        </th>
                        <th
                          className="text-right text-gray-500 px-5 py-2.5"
                          style={{ fontWeight: 600 }}
                        >
                          Sold
                        </th>
                        <th
                          className="text-right text-gray-500 px-5 py-2.5"
                          style={{ fontWeight: 600 }}
                        >
                          Time
                        </th>
                        <th
                          className="text-right text-gray-500 px-5 py-2.5"
                          style={{ fontWeight: 600 }}
                        >
                          Status
                        </th>
                        <th
                          className="text-right text-gray-500 px-5 py-2.5"
                          style={{ fontWeight: 600 }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-6 text-gray-400 text-sm"
                          >
                            Loading...
                          </td>
                        </tr>
                      ) : todaysLog.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-6 text-gray-400 text-sm"
                          >
                            No meals logged today.
                          </td>
                        </tr>
                      ) : (
                        todaysLog.map((l) => (
                          <tr
                            key={l.id}
                            className="border-b border-gray-50 hover:bg-[#F5F7FA] transition-colors"
                          >
                            <td
                              className="px-5 py-3 text-[#0E3442]"
                              style={{ fontWeight: 600 }}
                            >
                              {l.meal}
                            </td>
                            <td className="px-5 py-3 text-right text-gray-600">
                              {l.qty}
                            </td>
                            <td
                              className="px-5 py-3 text-right text-[#25A05F]"
                              style={{ fontWeight: 600 }}
                            >
                              {l.donated}
                            </td>
                            <td className="px-5 py-3 text-right text-gray-600">
                              {l.sold}
                            </td>
                            <td className="px-5 py-3 text-right text-gray-400">
                              {l.time}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs ${l.status === "available" ? "bg-[#25A05F]/10 text-[#25A05F]" : "bg-gray-100 text-gray-500"}`}
                                style={{ fontWeight: 600 }}
                              >
                                {l.status}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <button
                                onClick={() => {
                                  setDonationMealId(l.id);
                                  setDonationQty(1);
                                  setActiveTab("donations");
                                }}
                                disabled={!l.canDonate}
                                className={`px-3 py-1.5 rounded-lg text-xs ${l.canDonate ? "bg-[#25A05F]/10 text-[#25A05F] hover:bg-[#25A05F]/20" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                                style={{ fontWeight: 600 }}
                              >
                                Donate
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <h3
                      className="text-[#0E3442] mb-3"
                      style={{ fontWeight: 600 }}
                    >
                      Distribution Split
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Donation Route</span>
                          <span
                            className="text-[#25A05F]"
                            style={{ fontWeight: 600 }}
                          >
                            {donationPct}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#25A05F] rounded-full"
                            style={{ width: `${donationPct}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">
                            Marketplace Discount
                          </span>
                          <span
                            className="text-[#155433]"
                            style={{ fontWeight: 600 }}
                          >
                            {discountPct}% OFF
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#155433] rounded-full"
                            style={{ width: `${100 - donationPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-linear-to-br from-[#155433] to-[#25A05F] rounded-xl p-5 text-white">
                    <p
                      className="text-white/60 text-xs mb-1"
                      style={{ fontWeight: 600 }}
                    >
                      BRANCH ALIGNMENT
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl" style={{ fontWeight: 800 }}>
                        ✓
                      </p>
                      <p className="text-white text-sm">Settings Synced</p>
                    </div>
                    <p className="text-white/60 text-sm mt-2">
                      Managed centrally by manager
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "log" && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h2
                  className="text-[#0E3442] text-xl"
                  style={{ fontWeight: 700 }}
                >
                  Log New Surplus
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Submit meals before they expire — auto-distributed per manager
                  policy
                </p>
              </div>

              {submitMessage && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                  <Check size={14} /> {submitMessage}
                </div>
              )}

              {!myBranch ? (
                <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl border border-yellow-200">
                  <AlertTriangle size={16} className="inline mr-2" /> Cannot log
                  meals. Branch information not found.
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
                    <div>
                      <label
                        className="text-sm text-gray-600 mb-1.5 block"
                        style={{ fontWeight: 600 }}
                      >
                        Meal Name
                      </label>
                      <input
                        type="text"
                        value={mealName}
                        onChange={(e) => setMealName(e.target.value)}
                        placeholder="e.g. Grilled Chicken Rice"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all bg-gray-50 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          className="text-sm text-gray-600 mb-1.5 block"
                          style={{ fontWeight: 600 }}
                        >
                          Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#25A05F] bg-gray-50 text-sm"
                        >
                          <option>Main Course</option>
                          <option>Appetizer</option>
                          <option>Dessert</option>
                          <option>Bakery</option>
                          <option>Salad</option>
                          <option>Soup</option>
                          <option>Beverage</option>
                        </select>
                      </div>
                      <div>
                        <label
                          className="text-sm text-gray-600 mb-1.5 block"
                          style={{ fontWeight: 600 }}
                        >
                          Expiry Time
                        </label>
                        <div className="relative">
                          <Clock
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="time"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#25A05F] bg-gray-50 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          className="text-sm text-gray-600 mb-1.5 block"
                          style={{ fontWeight: 600 }}
                        >
                          Unit Price (EGP)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step="0.5"
                          value={unitPrice}
                          onChange={(e) =>
                            setUnitPrice(Math.max(0, Number(e.target.value)))
                          }
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#25A05F] bg-gray-50 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="text-sm text-gray-600 mb-1.5 block"
                        style={{ fontWeight: 600 }}
                      >
                        Quantity
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={18} className="text-gray-500" />
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(Math.max(1, Number(e.target.value)))
                          }
                          className="flex-1 text-center border border-gray-200 rounded-xl py-3 text-2xl text-[#0E3442] bg-gray-50"
                          style={{ fontWeight: 700 }}
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={18} className="text-gray-500" />
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p
                        className="text-sm text-[#0E3442] mb-3"
                        style={{ fontWeight: 600 }}
                      >
                        Distribution Destination
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allowDonation}
                            onChange={(e) => setAllowDonation(e.target.checked)}
                            className="mt-0.5"
                          />
                          <span>
                            <span
                              className="block text-sm text-[#0E3442]"
                              style={{ fontWeight: 600 }}
                            >
                              Route Donation Share
                            </span>
                            <span className="text-xs text-gray-500">
                              Uses branch split policy and creates donation
                              records automatically.
                            </span>
                          </span>
                        </label>
                        <label className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allowMarketplace}
                            onChange={(e) =>
                              setAllowMarketplace(e.target.checked)
                            }
                            className="mt-0.5"
                          />
                          <span>
                            <span
                              className="block text-sm text-[#0E3442]"
                              style={{ fontWeight: 600 }}
                            >
                              List for Customers
                            </span>
                            <span className="text-xs text-gray-500">
                              Remaining quantity appears in customer meal
                              listings.
                            </span>
                          </span>
                        </label>
                      </div>
                      {allowDonation && donatedPreview > 0 && (
                        <div className="mt-3">
                          <label
                            className="text-sm text-gray-600 mb-1.5 block"
                            style={{ fontWeight: 600 }}
                          >
                            Charity for Auto-Routing
                          </label>
                          <select
                            value={logCharityId}
                            onChange={(e) => setLogCharityId(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#25A05F] bg-white text-sm"
                          >
                            <option value="">Select charity</option>
                            {charities.map((charity) => (
                              <option key={charity._id} value={charity._id}>
                                {charity.organizationName || charity.fullName}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        className="text-sm text-gray-600 mb-1.5 block"
                        style={{ fontWeight: 600 }}
                      >
                        Notes (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        placeholder="e.g. Well-sealed containers"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#25A05F] bg-gray-50 text-sm resize-none"
                      />
                    </div>

                    <div>
                      <label
                        className="text-sm text-gray-600 mb-1.5 block"
                        style={{ fontWeight: 600 }}
                      >
                        Image URLs (Optional)
                      </label>
                      <textarea
                        value={imageUrlsInput}
                        onChange={(e) => setImageUrlsInput(e.target.value)}
                        rows={3}
                        placeholder={"https://...\nhttps://..."}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#25A05F] bg-gray-50 text-sm resize-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Add one URL per line (http/https).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="text-sm text-gray-600 mb-1.5 block"
                          style={{ fontWeight: 600 }}
                        >
                          Tags (Optional)
                        </label>
                        <input
                          type="text"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          placeholder="chicken, rice, grilled"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#25A05F] bg-gray-50 text-sm"
                        />
                      </div>
                      <div>
                        <label
                          className="text-sm text-gray-600 mb-1.5 block"
                          style={{ fontWeight: 600 }}
                        >
                          Allergens (Optional)
                        </label>
                        <input
                          type="text"
                          value={allergensInput}
                          onChange={(e) => setAllergensInput(e.target.value)}
                          placeholder="gluten, dairy, nuts"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#25A05F] bg-gray-50 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {quantity > 0 && (
                    <div className="mt-4 bg-[#0E3442] rounded-xl p-5 text-white">
                      <p
                        className="text-white/50 text-xs mb-3"
                        style={{ fontWeight: 600 }}
                      >
                        AUTO-DISTRIBUTION PREVIEW
                      </p>
                      <div className="flex gap-4">
                        <div className="flex-1 bg-white/10 rounded-xl p-4 text-center">
                          <Heart
                            size={22}
                            className="mx-auto mb-1 text-[#25A05F]"
                          />
                          <p className="text-3xl" style={{ fontWeight: 700 }}>
                            {donatedPreview}
                          </p>
                          <p className="text-white/50 text-xs mt-1">
                            Donation ({effectiveDonationPct}%)
                          </p>
                        </div>
                        <div className="flex-1 bg-white/10 rounded-xl p-4 text-center">
                          <ShoppingBag
                            size={22}
                            className="mx-auto mb-1 text-white/70"
                          />
                          <p className="text-3xl" style={{ fontWeight: 700 }}>
                            {discountedPreview}
                          </p>
                          <p className="text-white/50 text-xs mt-1">
                            {allowMarketplace
                              ? `Customer Listing (${discountPct}% off)`
                              : "Not listed to customers"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmitLog}
                    className={`w-full mt-5 py-4 rounded-xl text-white flex items-center justify-center gap-2 transition-all ${
                      submitted
                        ? "bg-[#155433]"
                        : !canSubmitLog
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-[#25A05F] hover:bg-[#1e8a4f]"
                    }`}
                    style={{ fontWeight: 700 }}
                  >
                    {submitting ? (
                      "Submitting..."
                    ) : submitted ? (
                      <>
                        <Check size={18} /> Submitted!
                      </>
                    ) : (
                      <>
                        <Send size={18} /> Submit Surplus
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {activeTab === "donations" && (
            <>
              <div className="mb-6">
                <h2
                  className="text-[#0E3442] text-xl"
                  style={{ fontWeight: 700 }}
                >
                  Route Meals to Charity
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Select an available meal, choose a charity, and confirm
                  quantity.
                </p>
              </div>

              {donationSaved && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                  <Check size={14} /> Donation created successfully.
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-5">
                  {donationEligibleMeals.length === 0 ? (
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                      No donation-eligible meals right now. Log a new available
                      meal first.
                    </div>
                  ) : charities.length === 0 ? (
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                      No active charities found. Ask your manager to create or
                      activate charity accounts.
                    </div>
                  ) : (
                    <>
                      <div>
                        <label
                          className="text-sm text-gray-600 mb-1.5 block"
                          style={{ fontWeight: 600 }}
                        >
                          Surplus Meal
                        </label>
                        <select
                          value={donationMealId}
                          onChange={(e) => setDonationMealId(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#25A05F] bg-gray-50 text-sm"
                        >
                          {donationEligibleMeals.map((meal) => (
                            <option key={meal._id} value={meal._id}>
                              {meal.title} · Available: {meal.quantityAvailable}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          className="text-sm text-gray-600 mb-1.5 block"
                          style={{ fontWeight: 600 }}
                        >
                          Charity Partner
                        </label>
                        <select
                          value={donationCharityId}
                          onChange={(e) => setDonationCharityId(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#25A05F] bg-gray-50 text-sm"
                        >
                          {charities.map((charity) => (
                            <option key={charity._id} value={charity._id}>
                              {charity.organizationName || charity.fullName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          className="text-sm text-gray-600 mb-1.5 block"
                          style={{ fontWeight: 600 }}
                        >
                          Donation Quantity
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              setDonationQty(Math.max(1, donationQty - 1))
                            }
                            className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={18} className="text-gray-500" />
                          </button>
                          <input
                            type="number"
                            value={donationQty}
                            onChange={(e) => {
                              const input = Number(e.target.value);
                              const max =
                                selectedDonationMeal?.quantityAvailable || 1;
                              setDonationQty(Math.max(1, Math.min(max, input)));
                            }}
                            className="flex-1 text-center border border-gray-200 rounded-xl py-3 text-2xl text-[#0E3442] bg-gray-50"
                            style={{ fontWeight: 700 }}
                          />
                          <button
                            onClick={() => {
                              const max =
                                selectedDonationMeal?.quantityAvailable || 1;
                              setDonationQty(Math.min(max, donationQty + 1));
                            }}
                            className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={18} className="text-gray-500" />
                          </button>
                        </div>
                        {selectedDonationMeal && (
                          <p className="text-xs text-gray-400 mt-2">
                            Maximum for this meal:{" "}
                            {selectedDonationMeal.quantityAvailable}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          className="text-sm text-gray-600 mb-1.5 block"
                          style={{ fontWeight: 600 }}
                        >
                          Notes (Optional)
                        </label>
                        <textarea
                          value={donationNotes}
                          onChange={(e) => setDonationNotes(e.target.value)}
                          rows={2}
                          placeholder="e.g. Pick up before closing"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#25A05F] bg-gray-50 text-sm resize-none"
                        />
                      </div>

                      <button
                        onClick={handleCreateDonation}
                        disabled={
                          !selectedDonationMeal ||
                          !selectedDonationCharity ||
                          donationQty < 1 ||
                          donating
                        }
                        className={`w-full mt-1 py-3.5 rounded-xl text-white flex items-center justify-center gap-2 transition-all ${
                          donationSaved
                            ? "bg-[#155433]"
                            : !selectedDonationMeal ||
                                !selectedDonationCharity ||
                                donationQty < 1 ||
                                donating
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-[#25A05F] hover:bg-[#1e8a4f]"
                        }`}
                        style={{ fontWeight: 700 }}
                      >
                        {donating ? (
                          "Creating..."
                        ) : donationSaved ? (
                          <>
                            <Check size={16} /> Donation Created
                          </>
                        ) : (
                          <>
                            <Heart size={16} /> Create Donation
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <h3
                    className="text-[#0E3442] mb-4"
                    style={{ fontWeight: 600 }}
                  >
                    Recent Donations
                  </h3>
                  <div className="space-y-3">
                    {donations.length === 0 ? (
                      <p className="text-sm text-gray-400">No donations yet.</p>
                    ) : (
                      donations.slice(0, 8).map((donation) => (
                        <div
                          key={donation._id}
                          className="rounded-xl border border-gray-100 bg-[#F5F7FA] px-3 py-2.5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p
                              className="text-sm text-[#0E3442]"
                              style={{ fontWeight: 600 }}
                            >
                              {donation.quantity} meals
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] ${
                                ["matched", "confirmed", "picked_up"].includes(
                                  donation.status,
                                )
                                  ? "bg-[#25A05F]/10 text-[#25A05F]"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                              style={{ fontWeight: 600 }}
                            >
                              {donation.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {charityNameById.get(donation.charityId) ||
                              "Charity"}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {new Date(donation.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "history" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="text-[#0E3442] text-xl"
                    style={{ fontWeight: 700 }}
                  >
                    Surplus History
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Review past surplus log entries
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Calendar
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="date"
                      value={date1}
                      onChange={(e) => setDate1(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#25A05F] shadow-sm"
                    />
                  </div>
                  <div className="relative">
                    <Calendar
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="date"
                      value={date2}
                      onChange={(e) => setDate2(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#25A05F] shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  {
                    label: "Total Meals (7d)",
                    value: weekHistory.reduce((s, d) => s + d.totalQty, 0),
                    color: "#25A05F",
                  },
                  {
                    label: "Total Donated (7d)",
                    value: weekHistory.reduce((s, d) => s + d.donated, 0),
                    color: "#155433",
                  },
                  {
                    label: "Total Sold (7d)",
                    value: weekHistory.reduce((s, d) => s + d.sold, 0),
                    color: "#0E3442",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center"
                  >
                    <p className="text-gray-500 text-xs">{s.label}</p>
                    <p
                      className="text-2xl mt-1"
                      style={{ fontWeight: 700, color: s.color }}
                    >
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#F5F7FA]">
                      <th
                        className="text-left text-gray-500 px-5 py-3"
                        style={{ fontWeight: 600 }}
                      >
                        Date
                      </th>
                      <th
                        className="text-right text-gray-500 px-5 py-3"
                        style={{ fontWeight: 600 }}
                      >
                        Entries
                      </th>
                      <th
                        className="text-right text-gray-500 px-5 py-3"
                        style={{ fontWeight: 600 }}
                      >
                        Total Qty
                      </th>
                      <th
                        className="text-right text-gray-500 px-5 py-3"
                        style={{ fontWeight: 600 }}
                      >
                        Donated
                      </th>
                      <th
                        className="text-right text-gray-500 px-5 py-3"
                        style={{ fontWeight: 600 }}
                      >
                        Sold
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekHistory.map((d) => (
                      <tr
                        key={d.date}
                        className="border-b border-gray-50 hover:bg-[#F5F7FA] transition-colors"
                      >
                        <td
                          className="px-5 py-3 text-[#0E3442]"
                          style={{ fontWeight: 600 }}
                        >
                          {d.date}
                        </td>
                        <td className="px-5 py-3 text-right text-gray-600">
                          {d.meals}
                        </td>
                        <td
                          className="px-5 py-3 text-right text-[#0E3442]"
                          style={{ fontWeight: 600 }}
                        >
                          {d.totalQty}
                        </td>
                        <td
                          className="px-5 py-3 text-right text-[#25A05F]"
                          style={{ fontWeight: 600 }}
                        >
                          {d.donated}
                        </td>
                        <td className="px-5 py-3 text-right text-gray-600">
                          {d.sold}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="text-[#0E3442] text-xl"
                    style={{ fontWeight: 700 }}
                  >
                    Notifications
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Updates and alerts
                  </p>
                </div>
              </div>
              <div className="space-y-3 max-w-2xl">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="bg-white rounded-xl p-4 border shadow-sm flex items-start gap-3 transition-all border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-yellow-50">
                      <AlertTriangle size={16} className="text-yellow-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[#0E3442] text-sm"
                        style={{ fontWeight: n.read ? 500 : 600 }}
                      >
                        {n.text}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "profile" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="text-[#0E3442] text-xl"
                    style={{ fontWeight: 700 }}
                  >
                    My Profile
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Manage your account information
                  </p>
                </div>
                {editing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-500 hover:bg-gray-50"
                      style={{ fontWeight: 600 }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-5 py-2 rounded-xl text-sm flex items-center gap-2 shadow-sm"
                      style={{ fontWeight: 600 }}
                    >
                      <Save size={14} /> Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className={`px-5 py-2 rounded-xl text-sm flex items-center gap-2 shadow-sm ${saved ? "bg-[#25A05F]/10 text-[#25A05F]" : "bg-[#25A05F] hover:bg-[#1e8a4f] text-white"}`}
                    style={{ fontWeight: 600 }}
                  >
                    {saved ? (
                      <>
                        <Check size={14} /> Saved!
                      </>
                    ) : (
                      <>
                        <Edit3 size={14} /> Edit
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="max-w-3xl">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                  <div className="h-24 bg-linear-to-r from-[#155433] to-[#25A05F]" />
                  <div className="px-6 pb-5 -mt-10">
                    <div className="flex items-end gap-4">
                      <div className="relative">
                        <div
                          className="w-20 h-20 rounded-2xl bg-[#25A05F] flex items-center justify-center text-white text-2xl border-4 border-white shadow-lg"
                          style={{ fontWeight: 800 }}
                        >
                          {profile?.fullName
                            ?.split(" ")
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2) || "S"}
                        </div>
                      </div>
                      <div className="pt-6">
                        <h3
                          className="text-[#0E3442] text-lg"
                          style={{ fontWeight: 700 }}
                        >
                          {profile?.fullName}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Branch Staff · {profile?.branchName || "Unassigned"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h3
                      className="text-[#0E3442] mb-4"
                      style={{ fontWeight: 600 }}
                    >
                      Personal Info
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          label: "Full Name",
                          value: profile?.fullName,
                          icon: User,
                        },
                        { label: "Email", value: profile?.email, icon: Mail },
                        {
                          label: "Phone",
                          value: profile?.phone || "Not set",
                          icon: Phone,
                        },
                        {
                          label: "Branch",
                          value: profile?.branchName || "Not set",
                          icon: MapPin,
                        },
                        {
                          label: "Restaurant",
                          value: profile?.restaurantName || "Not set",
                          icon: Building2,
                        },
                      ].map((f) => (
                        <div key={f.label}>
                          <label
                            className="text-gray-400 text-xs block mb-1"
                            style={{ fontWeight: 600 }}
                          >
                            {f.label}
                          </label>
                          {editing && f.label === "Full Name" ? (
                            <div className="relative">
                              <f.icon
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                              />
                              <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#0E3442] focus:outline-none focus:border-[#25A05F]"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-[#0E3442] py-1">
                              <f.icon size={14} className="text-gray-400" />{" "}
                              {f.value}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                      <h3
                        className="text-[#0E3442] mb-4"
                        style={{ fontWeight: 600 }}
                      >
                        Performance
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Meals Logged", value: meals.length },
                          { label: "Days Active", value: "Active" },
                        ].map((s) => (
                          <div
                            key={s.label}
                            className="bg-[#F5F7FA] rounded-xl p-3 text-center"
                          >
                            <p
                              className="text-[#0E3442] text-xl"
                              style={{ fontWeight: 700 }}
                            >
                              {s.value}
                            </p>
                            <p className="text-gray-400 text-[10px] mt-0.5">
                              {s.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

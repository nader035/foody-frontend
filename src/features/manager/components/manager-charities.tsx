"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Heart,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import {
  apiListDonations,
  apiListUsers,
  apiRegister,
  type CharityUser,
  type Donation,
} from "@/lib/api-client";

interface CharityView extends CharityUser {
  totalReceived: number;
  pendingDonations: number;
  lastUpdate?: string;
}

function formatDate(value?: string) {
  if (!value) {
    return "No activity";
  }
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ManagerCharities() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [charities, setCharities] = useState<CharityView[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedCharityId, setSelectedCharityId] = useState<string | null>(
    null,
  );
  const [showAddModal, setShowAddModal] = useState(false);

  const [newCharity, setNewCharity] = useState({
    fullName: "",
    email: "",
    phone: "",
    organizationName: "",
    organizationAddress: "",
    organizationWebsite: "",
    password: "Charity123",
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [users, donationResult] = await Promise.all([
        apiListUsers("charity"),
        apiListDonations({
          limit: 100,
          sortBy: "createdAt",
          sortDirection: "desc",
        }),
      ]);

      const donationByCharity = new Map<string, Donation[]>();
      donationResult.items.forEach((donation) => {
        const current = donationByCharity.get(donation.charityId) || [];
        current.push(donation);
        donationByCharity.set(donation.charityId, current);
      });

      const enriched: CharityView[] = users.map((charity) => {
        const charityDonations = donationByCharity.get(charity._id) || [];
        return {
          ...charity,
          totalReceived: charityDonations
            .filter((donation) => donation.status === "completed")
            .reduce((sum, donation) => sum + donation.quantity, 0),
          pendingDonations: charityDonations.filter((donation) =>
            ["matched", "confirmed", "picked_up"].includes(donation.status),
          ).length,
          lastUpdate: charityDonations[0]?.updatedAt,
        };
      });

      setCharities(enriched);
      setDonations(donationResult.items);
      setSelectedCharityId((current) => current || enriched[0]?._id || null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load charities",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) {
      return charities;
    }

    return charities.filter((charity) =>
      [
        charity.fullName,
        charity.organizationName,
        charity.email,
        charity.organizationAddress,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [charities, search]);

  const selectedCharity =
    charities.find((charity) => charity._id === selectedCharityId) || null;

  const selectedHistory = useMemo(
    () =>
      donations
        .filter((donation) => donation.charityId === selectedCharityId)
        .slice(0, 6),
    [donations, selectedCharityId],
  );

  const stats = useMemo(() => {
    const active = charities.length;
    const totalMeals = charities.reduce(
      (sum, charity) => sum + charity.totalReceived,
      0,
    );
    const pending = charities.reduce(
      (sum, charity) => sum + charity.pendingDonations,
      0,
    );

    return {
      active,
      totalMeals,
      pending,
    };
  }, [charities]);

  async function handleCreateCharity() {
    if (
      !newCharity.fullName ||
      !newCharity.email ||
      !newCharity.organizationName ||
      !newCharity.organizationAddress ||
      !newCharity.password
    ) {
      setErrorMessage("Please complete required fields");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      await apiRegister({
        fullName: newCharity.fullName,
        email: newCharity.email,
        password: newCharity.password,
        role: "charity",
        phone: newCharity.phone || undefined,
        organizationName: newCharity.organizationName,
        organizationAddress: newCharity.organizationAddress,
        organizationWebsite: newCharity.organizationWebsite || undefined,
      });

      setShowAddModal(false);
      setNewCharity({
        fullName: "",
        email: "",
        phone: "",
        organizationName: "",
        organizationAddress: "",
        organizationWebsite: "",
        password: "Charity123",
      });
      setSuccessMessage("Charity partner created successfully");
      await loadData();
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create charity",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-sm text-gray-500 shadow-sm">
        Loading charity partners...
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0E3442] text-2xl" style={{ fontWeight: 700 }}>
            Charity Partners
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Live charity accounts and donation activity from backend data
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors shadow-sm"
          style={{ fontWeight: 600 }}
        >
          <Plus size={16} /> Add Charity
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle size={14} /> {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
          <Check size={14} /> {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Charity Accounts", value: stats.active, icon: Users },
          { label: "Completed Meals", value: stats.totalMeals, icon: Package },
          { label: "Pending Donations", value: stats.pending, icon: Heart },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#25A05F]/10 rounded-xl flex items-center justify-center">
                <item.icon size={18} className="text-[#25A05F]" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">{item.label}</p>
                <p
                  className="text-[#0E3442] text-xl"
                  style={{ fontWeight: 700 }}
                >
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search charities..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] shadow-sm"
            />
          </div>

          <div className="space-y-3">
            {filtered.map((charity) => (
              <button
                key={charity._id}
                onClick={() => setSelectedCharityId(charity._id)}
                className={`w-full text-left bg-white rounded-xl border p-5 transition-all shadow-sm ${
                  selectedCharityId === charity._id
                    ? "border-[#25A05F]/50 shadow-md"
                    : "border-gray-100 hover:border-gray-200 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[#0E3442]" style={{ fontWeight: 700 }}>
                      {charity.organizationName || charity.fullName}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {charity.email}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {charity.organizationAddress || "No address"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-[#25A05F] text-lg"
                      style={{ fontWeight: 700 }}
                    >
                      {charity.totalReceived}
                    </p>
                    <p className="text-gray-400 text-[10px]">completed meals</p>
                    {charity.pendingDonations > 0 && (
                      <span
                        className="inline-block mt-1 bg-[#25A05F] text-white text-[10px] px-2 py-0.5 rounded-full"
                        style={{ fontWeight: 600 }}
                      >
                        {charity.pendingDonations} pending
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 text-sm text-gray-500 shadow-sm">
                No charities found.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {selectedCharity && (
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-[#0E3442] mb-4" style={{ fontWeight: 700 }}>
                {selectedCharity.organizationName || selectedCharity.fullName}
              </h3>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <Phone size={14} /> {selectedCharity.phone || "No phone"}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={14} /> {selectedCharity.email}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={14} />{" "}
                  {selectedCharity.organizationAddress || "No address"}
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Last activity: {formatDate(selectedCharity.lastUpdate)}
              </p>
            </div>
          )}

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-[#0E3442] mb-4" style={{ fontWeight: 700 }}>
              Recent Donation Activity
            </h3>
            <div className="space-y-3">
              {selectedHistory.map((donation) => (
                <div key={donation._id} className="text-sm">
                  <p className="text-[#0E3442]" style={{ fontWeight: 600 }}>
                    Qty {donation.quantity} •{" "}
                    {donation.status.replace("_", " ")}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {formatDate(donation.updatedAt)}
                  </p>
                </div>
              ))}

              {selectedHistory.length === 0 && (
                <p className="text-sm text-gray-500">
                  No donation activity for this charity yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2
                className="text-[#0E3442] text-lg"
                style={{ fontWeight: 700 }}
              >
                Add Charity Partner
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <input
                value={newCharity.fullName}
                onChange={(e) =>
                  setNewCharity({ ...newCharity, fullName: e.target.value })
                }
                placeholder="Contact Full Name *"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
              />
              <input
                value={newCharity.organizationName}
                onChange={(e) =>
                  setNewCharity({
                    ...newCharity,
                    organizationName: e.target.value,
                  })
                }
                placeholder="Organization Name *"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
              />
              <input
                value={newCharity.email}
                onChange={(e) =>
                  setNewCharity({ ...newCharity, email: e.target.value })
                }
                placeholder="Email *"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
              />
              <input
                value={newCharity.phone}
                onChange={(e) =>
                  setNewCharity({ ...newCharity, phone: e.target.value })
                }
                placeholder="Phone"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
              />
              <textarea
                value={newCharity.organizationAddress}
                onChange={(e) =>
                  setNewCharity({
                    ...newCharity,
                    organizationAddress: e.target.value,
                  })
                }
                placeholder="Organization Address *"
                rows={2}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F] resize-none"
              />
              <input
                value={newCharity.organizationWebsite}
                onChange={(e) =>
                  setNewCharity({
                    ...newCharity,
                    organizationWebsite: e.target.value,
                  })
                }
                placeholder="Website"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
              />
              <input
                value={newCharity.password}
                onChange={(e) =>
                  setNewCharity({ ...newCharity, password: e.target.value })
                }
                placeholder="Temporary Password *"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
              />
              <p className="text-xs text-gray-400">
                Password needs 8+ chars, 1 uppercase, 1 number.
              </p>
            </div>

            <div className="px-6 pb-6 flex justify-end">
              <button
                onClick={handleCreateCharity}
                disabled={saving}
                className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                style={{ fontWeight: 600 }}
              >
                {saving ? "Creating..." : "Create Charity"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

